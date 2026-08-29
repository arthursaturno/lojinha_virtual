import type { CatalogProductDto } from "@/features/catalog/data/dtos/catalog-product-dto";

export type CatalogProductsDataSource = {
  findAll(): Promise<CatalogProductDto[]>;
};

const baseVariants = (productId: string, price: number): CatalogProductDto["variants"] =>
  ["PP", "P", "M", "G", "GG", "XG"].flatMap((size, index) => [
    {
      id: `${productId}-${size}-preto-oversized`,
      size,
      color: "Preto",
      model: "Oversized",
      price,
      stock_quantity: 8 + index,
      is_active: true,
    },
    {
      id: `${productId}-${size}-branco-street`,
      size,
      color: "Branco",
      model: "Street",
      price,
      stock_quantity: index % 2 === 0 ? 4 : 0,
      is_active: true,
    },
  ]);

export class CatalogProductsMockDataSource implements CatalogProductsDataSource {
  async findAll(): Promise<CatalogProductDto[]> {
    return [
      {
        id: "1",
        slug: "camiseta-core-oversized",
        name: "Camiseta Core Oversized",
        category: "Camisetas",
        color: "Off white",
        price: 219.9,
        images: ["/assets/camiseta-core.png"],
        stock_quantity: 67,
        badge: "NOVO",
        variants: baseVariants("1", 219.9),
      },
      {
        id: "2",
        slug: "jaqueta-axis",
        name: "Jaqueta Axis",
        category: "Jaquetas",
        color: "Preto",
        price: 399.9,
        images: ["/assets/hero-clothing.png"],
        stock_quantity: 34,
        variants: baseVariants("2", 399.9),
      },
      {
        id: "3",
        slug: "camisa-utility-overshirt",
        name: "Camisa Utility Overshirt",
        category: "Roupas",
        color: "Preto",
        price: 279.9,
        images: ["/assets/hero-clothing.png"],
        stock_quantity: 48,
        variants: baseVariants("3", 279.9),
      },
      {
        id: "4",
        slug: "camiseta-street-logo",
        name: "Camiseta Street Logo",
        category: "Camisetas",
        color: "Branco",
        price: 199.9,
        images: ["/assets/camiseta-core.png"],
        stock_quantity: 61,
        variants: baseVariants("4", 199.9),
      },
      {
        id: "5",
        slug: "bolsa-utility-cross",
        name: "Bolsa Utility Cross",
        category: "Acessorios",
        color: "Preto",
        price: 189.9,
        images: ["/assets/bolsa-utility.png"],
        stock_quantity: 29,
        variants: baseVariants("5", 189.9),
      },
      {
        id: "6",
        slug: "camiseta-sketch",
        name: "Camiseta Sketch",
        category: "Camisetas",
        color: "Off white",
        price: 199.9,
        images: ["/assets/camiseta-core.png"],
        stock_quantity: 22,
        badge: "NOVO",
        variants: baseVariants("6", 199.9),
      },
    ];
  }
}
