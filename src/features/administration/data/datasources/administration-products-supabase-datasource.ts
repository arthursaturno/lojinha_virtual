import type { SupabaseClient } from "@supabase/supabase-js";

import type { AdministrationProductDto } from "@/features/administration/data/dtos/administration-product-dto";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type {
  AdministrationProductImageUpload,
  AdministrationProductImageUrls,
} from "@/features/administration/domain/entities/administration-product-image-upload";

export interface AdministrationProductsDataSource {
  findAll(): Promise<AdministrationProductDto[]>;
  create(product: AdministrationProduct): Promise<AdministrationProductDto>;
  update(product: AdministrationProduct): Promise<AdministrationProductDto>;
  delete(productId: string): Promise<void>;
  deleteImages(imageUrls: string[]): Promise<void>;
  uploadImage(upload: AdministrationProductImageUpload): Promise<AdministrationProductImageUrls>;
}

type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  is_active: boolean;
  product_images: Array<{
    image_url: string;
    position: number;
    crop_zoom: number;
    crop_offset_x: number;
    crop_offset_y: number;
  }>;
  product_variants: Array<{ id: string; size: string; color: string; model: string; price: number; stock_quantity: number; is_active: boolean }>;
};

const productImagesBucket = "product-images";
const productImagesPublicPathPrefix = "/storage/v1/object/public/product-images/";
const orphanImageMinimumAgeInMs = 15 * 60 * 1000;

function getProductImageStoragePath(imageUrl: string): string | null {
  try {
    const pathname = new URL(imageUrl).pathname;
    const pathStart = pathname.indexOf(productImagesPublicPathPrefix);

    return pathStart >= 0
      ? decodeURIComponent(pathname.slice(pathStart + productImagesPublicPathPrefix.length))
      : null;
  } catch {
    return null;
  }
}

function toDto(row: ProductRow): AdministrationProductDto {
  const variants = row.product_variants ?? [];
  const totalStockQuantity = variants.reduce((total, variant) => total + variant.stock_quantity, 0);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    color_label: variants[0]?.color ?? "Sem cor",
    base_price: Number(row.base_price),
    image_urls: [...(row.product_images ?? [])].sort((left, right) => left.position - right.position).map((image) => image.image_url),
    image_crops: [...(row.product_images ?? [])]
      .sort((left, right) => left.position - right.position)
      .map((image) => ({ zoom: Number(image.crop_zoom), offset_x: image.crop_offset_x, offset_y: image.crop_offset_y })),
    badge: row.is_active ? "NOVO" : "PAUSADO",
    is_active: row.is_active,
    total_stock_quantity: totalStockQuantity,
    variants: variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      model: variant.model,
      price: Number(variant.price),
      stock_quantity: variant.stock_quantity,
      status: variant.stock_quantity > 3 ? "in-stock" : "low-stock",
    })),
  };
}

export class AdministrationProductsSupabaseDataSource implements AdministrationProductsDataSource {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async findAll(): Promise<AdministrationProductDto[]> {
    const { data, error } = await this.supabaseClient
      .from("products")
      .select("id, name, description, category, base_price, is_active, product_images(image_url, position, crop_zoom, crop_offset_x, crop_offset_y), product_variants(id, size, color, model, price, stock_quantity, is_active)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as ProductRow[]).map(toDto);
  }

  async create(product: AdministrationProduct): Promise<AdministrationProductDto> {
    const { data: userData, error: userError } = await this.supabaseClient.auth.getUser();
    if (userError || !userData.user) throw new Error("Sessao administrativa nao encontrada.");
    const { data, error } = await this.supabaseClient.from("products").insert({ id: product.id, owner_id: userData.user.id, name: product.name, description: product.description, category: product.category, base_price: product.basePrice, is_active: product.isActive }).select("id").single();
    if (error || !data) throw new Error(error?.message ?? "Nao foi possivel criar o produto.");
    await this.replaceRelations(data.id as string, product);
    return this.findOne(data.id as string);
  }

  async update(product: AdministrationProduct): Promise<AdministrationProductDto> {
    const { data, error } = await this.supabaseClient
      .from("products")
      .update({
        name: product.name,
        description: product.description,
        category: product.category,
        base_price: product.basePrice,
        is_active: product.isActive,
      })
      .eq("id", product.id)
      .select("id")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Produto nao encontrado ou sessao sem permissao para edita-lo.");
    await this.replaceRelations(product.id, product);
    return this.findOne(data.id as string);
  }

  async delete(productId: string): Promise<void> {
    const { data: userData, error: userError } = await this.supabaseClient.auth.getUser();
    if (userError || !userData.user) throw new Error("Sessao administrativa nao encontrada.");

    const { data: images, error: imagesError } = await this.supabaseClient
      .from("product_images")
      .select("image_url")
      .eq("product_id", productId);
    if (imagesError) throw new Error(imagesError.message);

    await this.deleteImages((images ?? []).map((image) => image.image_url));
    await this.deleteStaleOrphanedImages(userData.user.id);

    const { error } = await this.supabaseClient.from("products").delete().eq("id", productId);
    if (error) throw new Error(error.message);
  }

  async deleteImages(imageUrls: string[]): Promise<void> {
    const objectPaths = imageUrls.flatMap((imageUrl) => {
      const objectPath = getProductImageStoragePath(imageUrl);
      return objectPath ? [objectPath] : [];
    });

    if (objectPaths.length === 0) return;

    const { error } = await this.supabaseClient.storage.from(productImagesBucket).remove(objectPaths);
    if (error) throw new Error(error.message);
  }

  async uploadImage(upload: AdministrationProductImageUpload): Promise<AdministrationProductImageUrls> {
    const { data: userData, error: userError } = await this.supabaseClient.auth.getUser();
    if (userError || !userData.user) throw new Error("Sessao administrativa nao encontrada.");

    const uploadId = crypto.randomUUID();
    const detailPath = upload.productId
      ? `${userData.user.id}/products/${upload.productId}/${uploadId}-${upload.detail.fileName}`
      : `${userData.user.id}/details/${uploadId}-${upload.detail.fileName}`;
    const bucket = this.supabaseClient.storage.from(productImagesBucket);
    const { error: detailError } = await bucket.upload(detailPath, upload.detail.bytes, {
      contentType: upload.detail.contentType,
      upsert: false,
    });

    if (detailError) {
      throw new Error(detailError.message);
    }

    return {
      detailUrl: bucket.getPublicUrl(detailPath).data.publicUrl,
      thumbnailUrl: bucket.getPublicUrl(detailPath).data.publicUrl,
    };
  }

  private async replaceRelations(productId: string, product: AdministrationProduct) {
    const [{ error: variantsDeleteError }, { error: imagesDeleteError }] = await Promise.all([
      this.supabaseClient.from("product_variants").delete().eq("product_id", productId),
      this.supabaseClient.from("product_images").delete().eq("product_id", productId),
    ]);
    if (variantsDeleteError || imagesDeleteError) throw new Error(variantsDeleteError?.message ?? imagesDeleteError?.message);
    const variants = product.variants.map((variant) => ({ product_id: productId, size: variant.size, color: variant.color, model: variant.model, price: variant.price, stock_quantity: variant.stockQuantity, is_active: product.isActive }));
    const images = product.imageUrls.slice(0, 5).map((imageUrl, position) => {
      const crop = product.imageCrops?.[position] ?? { zoom: 1, offsetX: 0, offsetY: 0 };
      return {
        product_id: productId,
        image_url: imageUrl,
        position,
        crop_zoom: crop.zoom,
        crop_offset_x: crop.offsetX,
        crop_offset_y: crop.offsetY,
      };
    });
    if (variants.length) { const { error } = await this.supabaseClient.from("product_variants").insert(variants); if (error) throw new Error(error.message); }
    if (images.length) { const { error } = await this.supabaseClient.from("product_images").insert(images); if (error) throw new Error(error.message); }
  }

  private async deleteStaleOrphanedImages(ownerId: string): Promise<void> {
    const bucket = this.supabaseClient.storage.from(productImagesBucket);
    const folder = `${ownerId}/details`;
    const [{ data: storedObjects, error: storedObjectsError }, { data: productImages, error: productImagesError }] = await Promise.all([
      bucket.list(folder, { limit: 1000 }),
      this.supabaseClient.from("product_images").select("image_url"),
    ]);
    if (storedObjectsError) throw new Error(storedObjectsError.message);
    if (productImagesError) throw new Error(productImagesError.message);

    const referencedPaths = new Set(
      (productImages ?? [])
        .flatMap((image) => {
          const path = getProductImageStoragePath(image.image_url);
          return path ? [path] : [];
        }),
    );
    const expirationTime = Date.now() - orphanImageMinimumAgeInMs;
    const orphanPaths = (storedObjects ?? [])
      .filter((object) => object.created_at && new Date(object.created_at).getTime() <= expirationTime)
      .map((object) => `${folder}/${object.name}`)
      .filter((path) => !referencedPaths.has(path));

    if (orphanPaths.length === 0) return;

    const { error } = await bucket.remove(orphanPaths);
    if (error) throw new Error(error.message);
  }

  private async findOne(productId: string): Promise<AdministrationProductDto> {
    const { data, error } = await this.supabaseClient.from("products").select("id, name, description, category, base_price, is_active, product_images(image_url, position, crop_zoom, crop_offset_x, crop_offset_y), product_variants(id, size, color, model, price, stock_quantity, is_active)").eq("id", productId).single();
    if (error || !data) throw new Error(error?.message ?? "Produto nao encontrado.");
    return toDto(data as unknown as ProductRow);
  }
}
