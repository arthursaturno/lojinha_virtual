export type AdministrationProductImageUpload = {
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
