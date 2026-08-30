import type { AdministrationProductImageUpload } from "@/features/administration/domain/entities/administration-product-image-upload";

type ProductImageCrop = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

const productImageRatio = 4 / 5;
const maximumSourceBytes = 15 * 1024 * 1024;

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Nao foi possivel processar a foto."))), "image/webp", quality);
  });
}

async function loadImage(source: Blob): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(source);

  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function renderProductImage(
  image: HTMLImageElement,
  width: number,
  crop: ProductImageCrop,
  quality: number,
): Promise<Blob> {
  const height = Math.round(width / productImageRatio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Nao foi possivel preparar a foto.");
  }

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * crop.zoom;
  const renderedWidth = image.naturalWidth * scale;
  const renderedHeight = image.naturalHeight * scale;
  const offsetX = (crop.offsetX / 80) * width * 0.12;
  const offsetY = (crop.offsetY / 80) * height * 0.12;

  context.drawImage(
    image,
    (width - renderedWidth) / 2 + offsetX,
    (height - renderedHeight) / 2 + offsetY,
    renderedWidth,
    renderedHeight,
  );

  return canvasToWebp(canvas, quality);
}

export async function createProductImageUpload(
  source: Blob,
  crop: ProductImageCrop,
): Promise<AdministrationProductImageUpload> {
  if (source.size === 0 || source.size > maximumSourceBytes) {
    throw new Error("A foto deve ter no maximo 15 MB.");
  }

  const image = await loadImage(source);
  const detail = await renderProductImage(image, 1200, crop, 0.82);
  const fileName = `product-${Date.now()}.webp`;

  return {
    detail: { bytes: await detail.arrayBuffer(), fileName, contentType: "image/webp" },
  };
}
