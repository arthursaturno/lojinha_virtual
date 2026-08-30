import type { AdministrationProductDto } from "@/features/administration/data/dtos/administration-product-dto";

export interface AdministrationProductsDataSource {
  findAll(): Promise<AdministrationProductDto[]>;
}

const products: AdministrationProductDto[] = [
  {
    id: "admin-1",
    name: "Camiseta Core Oversized",
    category: "Camisetas",
    color_label: "Off white",
    base_price: 219.9,
    image_urls: ["/assets/camiseta-core.png", "/assets/hero-clothing.png", "/assets/camiseta-core.png"],
    badge: "NOVO",
    total_stock_quantity: 67,
    variants: [
      { id: "1", size: "G", color: "Preto", model: "Oversized", price: 219.9, stock_quantity: 12, status: "in-stock" },
      { id: "2", size: "M", color: "Branco", model: "Oversized", price: 219.9, stock_quantity: 8, status: "in-stock" },
      { id: "3", size: "GG", color: "Verde", model: "Street", price: 229.9, stock_quantity: 4, status: "low-stock" },
    ],
  },
  {
    id: "admin-2",
    name: "Jaqueta Axis",
    category: "Jaquetas",
    color_label: "Preto",
    base_price: 399.9,
    image_urls: ["/assets/hero-clothing.png", "/assets/camiseta-core.png", "/assets/hero-clothing.png"],
    total_stock_quantity: 34,
    variants: [
      { id: "4", size: "M", color: "Preto", model: "Utility", price: 399.9, stock_quantity: 9, status: "in-stock" },
      { id: "5", size: "G", color: "Preto", model: "Utility", price: 399.9, stock_quantity: 6, status: "in-stock" },
      { id: "6", size: "GG", color: "Cinza", model: "Street", price: 419.9, stock_quantity: 2, status: "low-stock" },
    ],
  },
  {
    id: "admin-3",
    name: "Camisa Utility Overshirt",
    category: "Roupas",
    color_label: "Preto",
    base_price: 279.9,
    image_urls: ["/assets/hero-clothing.png", "/assets/bolsa-utility.png", "/assets/camiseta-core.png"],
    total_stock_quantity: 48,
    variants: [
      { id: "7", size: "P", color: "Preto", model: "Utility", price: 279.9, stock_quantity: 14, status: "in-stock" },
      { id: "8", size: "M", color: "Preto", model: "Utility", price: 279.9, stock_quantity: 10, status: "in-stock" },
      { id: "9", size: "G", color: "Verde", model: "Lifestyle", price: 289.9, stock_quantity: 5, status: "low-stock" },
    ],
  },
  {
    id: "admin-4",
    name: "Camiseta Street Logo",
    category: "Camisetas",
    color_label: "Branco",
    base_price: 199.9,
    image_urls: ["/assets/camiseta-core.png", "/assets/hero-clothing.png", "/assets/camiseta-core.png"],
    total_stock_quantity: 61,
    variants: [
      { id: "10", size: "M", color: "Branco", model: "Street", price: 199.9, stock_quantity: 15, status: "in-stock" },
      { id: "11", size: "G", color: "Branco", model: "Street", price: 199.9, stock_quantity: 11, status: "in-stock" },
      { id: "12", size: "GG", color: "Preto", model: "Oversized", price: 209.9, stock_quantity: 3, status: "low-stock" },
    ],
  },
  {
    id: "admin-5",
    name: "Bolsa Utility Cross",
    category: "Acessorios",
    color_label: "Preto",
    base_price: 189.9,
    image_urls: ["/assets/bolsa-utility.png", "/assets/hero-clothing.png", "/assets/camiseta-core.png"],
    total_stock_quantity: 29,
    variants: [
      { id: "13", size: "UN", color: "Preto", model: "Utility", price: 189.9, stock_quantity: 12, status: "in-stock" },
      { id: "14", size: "UN", color: "Cinza", model: "Lifestyle", price: 189.9, stock_quantity: 9, status: "in-stock" },
      { id: "15", size: "UN", color: "Verde", model: "Utility", price: 199.9, stock_quantity: 2, status: "low-stock" },
    ],
  },
];

export class AdministrationProductsMockDataSource implements AdministrationProductsDataSource {
  async findAll(): Promise<AdministrationProductDto[]> {
    return products;
  }
}
