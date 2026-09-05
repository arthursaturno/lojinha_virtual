export type AdministrationProductImageUpload = {
  productId?: string;
  detail: {
    bytes: ArrayBuffer;
    fileName: string;
    contentType: "image/webp";
  };
};

export type AdministrationProductImageUrls = {
  detailUrl: string;
  thumbnailUrl: string;
};
