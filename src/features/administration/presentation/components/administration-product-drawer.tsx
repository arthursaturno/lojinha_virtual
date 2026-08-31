"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiCrop, FiImage, FiMinus, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";

import { catalogProductImageAspectRatio } from "@/core/theme/catalog";
import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { createProductImageUpload } from "@/core/utils/images/create-product-image-upload";
import type { AdministrationProductImageUpload } from "@/features/administration/domain/entities/administration-product-image-upload";
import {
  administrationCategoryOptions,
  administrationColorOptions,
  type AdministrationImageCrop,
  administrationModelOptions,
  administrationSizeOptions,
  type AdministrationEditorMode,
  type AdministrationProductDraft,
  type AdministrationSaveStatus,
} from "@/features/administration/presentation/viewmodels/administration-dashboard-view-state";

type AdministrationProductDrawerProps = {
  isOpen: boolean;
  mode: AdministrationEditorMode;
  saveStatus: AdministrationSaveStatus;
  draft: AdministrationProductDraft;
  onClose(): void;
  onSave(): void;
  onFieldChange(field: "name" | "category" | "description", value: string): void;
  onPriceChange(value: string): void;
  onIncrementStock(): void;
  onDecrementStock(): void;
  onToggleActive(): void;
  onToggleOption(field: "sizes" | "colors" | "models", value: string): void;
  onImageChange(index: 0 | 1 | 2, value: string): void;
  onImageUpload(index: 0 | 1 | 2, upload: AdministrationProductImageUpload): Promise<boolean>;
  onImageUploadFailure(message: string): void;
  onImageCropChange(
    index: 0 | 1 | 2,
    patch: { zoom?: number; offsetX?: number; offsetY?: number },
  ): void;
  onDelete(): void;
};

type TextFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange(value: string): void;
};

type ToggleGroupProps = {
  label: string;
  helper: string;
  options: readonly string[];
  selectedValues: string[];
  onToggle(value: string): void;
};

type SingleSelectGroupProps = {
  label: string;
  helper: string;
  options: readonly string[];
  selectedValue: string;
  onSelect(value: string): void;
};

type CropModalState = {
  index: 0 | 1 | 2;
  imageUrl: string;
  crop: AdministrationImageCrop;
  isPendingUpload: boolean;
  source?: Blob;
};

function TextField({ label, value, placeholder, onChange }: TextFieldProps) {
  return (
    <label className="block">
      <span
        className="mb-2 block font-black text-[var(--color-muted)]"
        style={{ fontSize: administrationTypography.fieldLabel }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full border border-[var(--color-border)] bg-white px-3 outline-none"
        style={{ fontSize: administrationTypography.body }}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextAreaField({ label, value, placeholder, onChange }: TextFieldProps) {
  return (
    <label className="block">
      <span
        className="mb-2 block font-black text-[var(--color-muted)]"
        style={{ fontSize: administrationTypography.fieldLabel }}
      >
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full resize-y border border-[var(--color-border)] bg-white px-3 py-3 outline-none"
        style={{ fontSize: administrationTypography.body }}
        placeholder={placeholder}
      />
    </label>
  );
}

function ToggleGroup({
  label,
  helper,
  options,
  selectedValues,
  onToggle,
}: ToggleGroupProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span
          className="font-black text-[var(--color-muted)]"
          style={{ fontSize: administrationTypography.fieldLabel }}
        >
          {label}
        </span>
        <span
          className="font-semibold text-[var(--color-muted)]"
          style={{ fontSize: administrationTypography.helper }}
        >
          {helper}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`min-w-[52px] border px-3 py-2 font-black transition ${
                isSelected
                  ? "border-black bg-[var(--color-lime)] text-black"
                  : "border-[var(--color-border)] bg-white text-[var(--color-foreground)]"
              }`}
              style={{ fontSize: administrationTypography.action }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SingleSelectGroup({
  label,
  helper,
  options,
  selectedValue,
  onSelect,
}: SingleSelectGroupProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span
          className="font-black text-[var(--color-muted)]"
          style={{ fontSize: administrationTypography.fieldLabel }}
        >
          {label}
        </span>
        <span
          className="font-semibold text-[var(--color-muted)]"
          style={{ fontSize: administrationTypography.helper }}
        >
          {helper}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`border px-3 py-2 font-black transition ${
                isSelected
                  ? "border-black bg-[var(--color-lime)] text-black"
                  : "border-[var(--color-border)] bg-white text-[var(--color-foreground)]"
              }`}
              style={{ fontSize: administrationTypography.action }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdministrationProductDrawer({
  isOpen,
  mode,
  saveStatus,
  draft,
  onClose,
  onSave,
  onFieldChange,
  onPriceChange,
  onIncrementStock,
  onDecrementStock,
  onToggleActive,
  onToggleOption,
  onImageChange,
  onImageUpload,
  onImageUploadFailure,
  onImageCropChange,
  onDelete,
}: AdministrationProductDrawerProps) {
  const createdBlobUrlsRef = useRef<string[]>([]);
  const [cropModalState, setCropModalState] = useState<CropModalState | null>(null);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);

  useEffect(() => {
    return () => {
      createdBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdBlobUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    if (cropModalState) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
    };
  }, [cropModalState]);

  function releaseImagePreview(imageUrl: string) {
    if (!imageUrl.startsWith("blob:")) {
      return;
    }

    URL.revokeObjectURL(imageUrl);
    createdBlobUrlsRef.current = createdBlobUrlsRef.current.filter((url) => url !== imageUrl);
  }

  if (!isOpen) {
    return null;
  }

  function handleImageSelection(index: 0 | 1 | 2, file: File | undefined) {
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    createdBlobUrlsRef.current.push(previewUrl);
    setCropModalState({
      index,
      imageUrl: previewUrl,
      crop: { zoom: 1, offsetX: 0, offsetY: 0 },
      isPendingUpload: true,
      source: file,
    });
  }

  function handleRemoveImage(index: 0 | 1 | 2) {
    releaseImagePreview(draft.imageUrls[index]);
    onImageChange(index, "");
    onImageCropChange(index, { zoom: 1, offsetX: 0, offsetY: 0 });

    if (cropModalState?.index === index) {
      handleCloseCropModal();
    }
  }

  function handleOpenExistingCrop(index: 0 | 1 | 2) {
    if (!draft.imageUrls[index]) {
      return;
    }

    setCropModalState({
      index,
      imageUrl: draft.imageUrls[index],
      crop: { ...draft.imageCrops[index] },
      isPendingUpload: false,
    });
  }

  function handleCropValueChange(patch: Partial<AdministrationImageCrop>) {
    setCropModalState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        crop: {
          ...current.crop,
          ...patch,
        },
      };
    });
  }

  function handleCloseCropModal() {
    setCropModalState((current) => {
      if (current?.isPendingUpload) {
        releaseImagePreview(current.imageUrl);
      }

      return null;
    });
  }

  async function handleApplyCrop() {
    if (!cropModalState) {
      return;
    }

    const { index, imageUrl, crop, source } = cropModalState;
    setIsApplyingCrop(true);

    try {
      let imageSource = source;
      if (!imageSource) {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Nao foi possivel carregar a foto para recorte.");
        imageSource = await response.blob();
      }
      const upload = await createProductImageUpload(imageSource, crop);
      const wasUploaded = await onImageUpload(index, upload);
      if (!wasUploaded) return;

      if (cropModalState.isPendingUpload) {
        releaseImagePreview(imageUrl);
      }
      onImageCropChange(index, { zoom: 1, offsetX: 0, offsetY: 0 });
      setCropModalState(null);
    } catch (error) {
      onImageUploadFailure(
        error instanceof Error ? error.message : "Nao foi possivel preparar a foto para envio.",
      );
    } finally {
      setIsApplyingCrop(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/45" onMouseDown={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full overflow-auto bg-[#f7f7f5] px-4 py-4 md:px-6"
        style={{ maxWidth: administrationLayout.drawerMaxWidth }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-[var(--color-border)] bg-[#f7f7f5] px-4 py-4 md:-mx-6 md:px-6">
          <div>
            <span
              className="font-black text-[var(--color-muted)]"
              style={{ fontSize: administrationTypography.eyebrow }}
            >
              {mode === "create" ? "NOVO PRODUTO" : "EDITAR PRODUTO"}
            </span>
            <h2
              className="mt-1 font-black text-[var(--color-foreground)]"
              style={{ fontSize: "clamp(1.25rem, 1.16rem + 0.35vw, 1.5rem)" }}
            >
              {draft.name || "Produto sem nome"}
            </h2>
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center border border-[var(--color-border)] bg-white"
            onClick={onClose}
            aria-label="Fechar editor do produto"
          >
            <FiX aria-hidden="true" className="text-lg" />
          </button>
        </div>

        <section className="border border-[var(--color-border)] bg-white px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <strong style={{ fontSize: administrationTypography.sectionTitle }} className="font-black">
              DADOS PRINCIPAIS
            </strong>
            <span
              className="font-semibold text-[var(--color-muted)]"
              style={{ fontSize: administrationTypography.helper }}
            >
              {saveStatus === "saved" ? "Salvo localmente" : "Rascunho"}
            </span>
          </div>
          <div className="grid gap-4">
            <TextField
              label="NOME DO PRODUTO"
              value={draft.name}
              placeholder="Ex.: Camiseta Core Oversized"
              onChange={(value) => onFieldChange("name", value)}
            />

            <TextAreaField
              label="DESCRICAO"
              value={draft.description}
              placeholder="Explique tecido, caimento, detalhes e ocasiao de uso."
              onChange={(value) => onFieldChange("description", value)}
            />

            <SingleSelectGroup
              label="CATEGORIA"
              helper="Escolha uma categoria principal"
              options={administrationCategoryOptions}
              selectedValue={draft.category}
              onSelect={(value) => onFieldChange("category", value)}
            />

            <div className="grid gap-4 md:grid-cols-[1fr_170px]">
              <TextField
                label="PRECO BASE"
                value={draft.basePrice}
                placeholder="0,00"
                onChange={onPriceChange}
              />

              <div>
                <span
                  className="mb-2 block font-black text-[var(--color-muted)]"
                  style={{ fontSize: administrationTypography.fieldLabel }}
                >
                  ESTOQUE TOTAL
                </span>
                <div className="grid h-11 grid-cols-[44px_1fr_44px] border border-[var(--color-border)] bg-white">
                  <button
                    type="button"
                    onClick={onDecrementStock}
                    className="grid place-items-center border-r border-[var(--color-border)] text-[var(--color-foreground)]"
                    aria-label="Diminuir estoque"
                  >
                    <FiMinus aria-hidden="true" />
                  </button>
                  <div
                    className="grid place-items-center font-black"
                    style={{ fontSize: administrationTypography.body }}
                  >
                    {draft.totalStockQuantity}
                  </div>
                  <button
                    type="button"
                    onClick={onIncrementStock}
                    className="grid place-items-center border-l border-[var(--color-border)] text-[var(--color-foreground)]"
                    aria-label="Aumentar estoque"
                  >
                    <FiPlus aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border border-[var(--color-border)] bg-[#fafaf8] p-3">
              <div>
                <span
                  className="block font-black text-[var(--color-foreground)]"
                  style={{ fontSize: administrationTypography.fieldLabel }}
                >
                  VISIVEL NA LOJA
                </span>
                <span
                  className="mt-1 block text-[var(--color-muted)]"
                  style={{ fontSize: administrationTypography.helper }}
                >
                  {draft.isActive ? "Produto ativo para clientes." : "Produto pausado e oculto da vitrine."}
                </span>
              </div>
              <button
                type="button"
                className={`h-10 min-w-24 border px-3 font-black ${
                  draft.isActive
                    ? "border-black bg-[var(--color-lime)] text-black"
                    : "border-[var(--color-border)] bg-white text-[var(--color-foreground)]"
                }`}
                style={{ fontSize: administrationTypography.action }}
                onClick={onToggleActive}
              >
                {draft.isActive ? "ATIVO" : "PAUSADO"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 border border-[var(--color-border)] bg-white px-4 py-4">
          <strong
            className="mb-4 block font-black"
            style={{ fontSize: administrationTypography.sectionTitle }}
          >
            CONFIGURACAO DO PRODUTO
          </strong>
          <div className="grid gap-5">
            <ToggleGroup
              label="TAMANHOS"
              helper="Selecione os tamanhos disponiveis"
              options={administrationSizeOptions}
              selectedValues={draft.sizes}
              onToggle={(value) => onToggleOption("sizes", value)}
            />
            <ToggleGroup
              label="CORES"
              helper="Marque as cores que o cliente pode escolher"
              options={administrationColorOptions}
              selectedValues={draft.colors}
              onToggle={(value) => onToggleOption("colors", value)}
            />
            <ToggleGroup
              label="MODELAGEM"
              helper="Defina o estilo principal da peca"
              options={administrationModelOptions}
              selectedValues={draft.models}
              onToggle={(value) => onToggleOption("models", value)}
            />
          </div>
        </section>

        <section className="mt-5 border border-[var(--color-border)] bg-white px-4 py-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <strong style={{ fontSize: administrationTypography.sectionTitle }} className="font-black">
              FOTOS DO PRODUTO
            </strong>
            <span
              className="font-semibold text-[var(--color-muted)]"
              style={{ fontSize: administrationTypography.helper }}
            >
              Upload direto do celular ou camera
            </span>
          </div>
          <div className="grid gap-4">
            {draft.imageUrls.map((imageUrl, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-[132px_1fr]">
                <div
                  className="relative w-full overflow-hidden border border-[var(--color-border)] bg-[#f3f3f3]"
                  style={{ aspectRatio: catalogProductImageAspectRatio }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`Foto ${index + 1}`}
                      fill
                      sizes="132px"
                      className="object-cover"
                      style={{
                        objectPosition: `calc(50% + ${draft.imageCrops[index].offsetX}px) calc(50% + ${draft.imageCrops[index].offsetY}px)`,
                        transform: `scale(${draft.imageCrops[index].zoom})`,
                      }}
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
                      <FiImage aria-hidden="true" className="text-3xl" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-3 border border-[var(--color-border)] bg-[#fafaf8] p-3">
                  <div>
                    <span
                      className="block font-black text-[var(--color-muted)]"
                      style={{ fontSize: administrationTypography.fieldLabel }}
                    >
                      FOTO {index + 1}
                    </span>
                    <p
                      className="mt-2 text-[var(--color-foreground)]"
                      style={{ fontSize: administrationTypography.body }}
                    >
                      {imageUrl ? "Imagem pronta para o cadastro." : "Selecione uma foto do aparelho."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label
                      className="inline-flex h-10 cursor-pointer items-center gap-2 border border-[var(--color-border)] bg-white px-3 font-black text-[var(--color-foreground)]"
                      style={{ fontSize: administrationTypography.action }}
                    >
                      <FiUpload aria-hidden="true" />
                      ENVIAR FOTO
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          handleImageSelection(index as 0 | 1 | 2, event.target.files?.[0])
                        }
                      />
                    </label>
                    {imageUrl ? (
                      <button
                        type="button"
                        className="inline-flex h-10 items-center gap-2 border border-[var(--color-border)] bg-white px-3 font-black"
                        style={{ fontSize: administrationTypography.action }}
                        onClick={() => handleOpenExistingCrop(index as 0 | 1 | 2)}
                      >
                        <FiCrop aria-hidden="true" />
                        RECORTAR
                      </button>
                    ) : null}
                    {imageUrl ? (
                      <button
                        type="button"
                        className="h-10 border border-[var(--color-border)] bg-white px-3 font-black"
                        style={{ fontSize: administrationTypography.action }}
                        onClick={() => handleRemoveImage(index as 0 | 1 | 2)}
                      >
                        REMOVER
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {mode === "edit" ? (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 border border-red-700 bg-white px-5 font-black text-red-800"
              style={{ fontSize: administrationTypography.action }}
              onClick={onDelete}
            >
              <FiTrash2 aria-hidden="true" />
              EXCLUIR PRODUTO
            </button>
          ) : (
            <span className="hidden md:block" />
          )}
          <div className="flex flex-col gap-3 md:flex-row">
          <button
            type="button"
            className="h-11 border border-[var(--color-border)] bg-white px-5 font-black"
            style={{ fontSize: administrationTypography.action }}
            onClick={onClose}
          >
            FECHAR
          </button>
          <button
            type="button"
            className="h-11 bg-[var(--color-lime)] px-5 font-black text-black"
            style={{ fontSize: administrationTypography.action }}
            onClick={onSave}
          >
            {saveStatus === "saved" ? "SALVO" : "SALVAR PRODUTO"}
          </button>
          </div>
        </div>
      </aside>

      {cropModalState ? (
        <div
          className="absolute inset-0 z-10 overflow-y-auto bg-black/60 p-4 overscroll-contain"
          onMouseDown={handleCloseCropModal}
        >
          <div
            className="mx-auto my-4 w-full border border-[var(--color-border)] bg-[#f7f7f5] p-4 md:my-8 md:p-6"
            style={{ maxWidth: administrationLayout.cropModalMaxWidth }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <span
                  className="font-black text-[var(--color-muted)]"
                  style={{ fontSize: administrationTypography.eyebrow }}
                >
                  AJUSTE DE FOTO
                </span>
                <h3
                  className="mt-1 font-black text-[var(--color-foreground)]"
                  style={{ fontSize: "clamp(1.25rem, 1.16rem + 0.35vw, 1.5rem)" }}
                >
                  Recorte da foto {cropModalState.index + 1}
                </h3>
              </div>
              <button
                type="button"
                className="grid size-10 place-items-center border border-[var(--color-border)] bg-white"
                onClick={handleCloseCropModal}
                aria-label="Fechar ajuste da foto"
              >
                <FiX aria-hidden="true" className="text-lg" />
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div
                className="relative w-full overflow-hidden border border-[var(--color-border)] bg-[#f3f3f3]"
                style={{ aspectRatio: catalogProductImageAspectRatio }}
              >
                <Image
                  src={cropModalState.imageUrl}
                  alt={`Recorte da foto ${cropModalState.index + 1}`}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 32px), 720px"
                  className="object-cover"
                  style={{
                    objectPosition: `calc(50% + ${cropModalState.crop.offsetX}px) calc(50% + ${cropModalState.crop.offsetY}px)`,
                    transform: `scale(${cropModalState.crop.zoom})`,
                  }}
                  unoptimized
                />
              </div>

              <div
                className="border border-[var(--color-border)] bg-white p-4 md:p-5"
                style={{ maxWidth: administrationLayout.cropControlsWidth }}
              >
                <div className="grid gap-4">
                  <label className="block">
                    <span
                      className="mb-1 block font-black text-[var(--color-muted)]"
                      style={{ fontSize: administrationTypography.fieldLabel }}
                    >
                      ZOOM DO RECORTE
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="2.6"
                      step="0.1"
                      value={cropModalState.crop.zoom}
                      onChange={(event) => handleCropValueChange({ zoom: Number(event.target.value) })}
                      className="w-full accent-black"
                    />
                  </label>

                  <label className="block">
                    <span
                      className="mb-1 block font-black text-[var(--color-muted)]"
                      style={{ fontSize: administrationTypography.fieldLabel }}
                    >
                      AJUSTE HORIZONTAL
                    </span>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      step="2"
                      value={cropModalState.crop.offsetX}
                      onChange={(event) =>
                        handleCropValueChange({ offsetX: Number(event.target.value) })
                      }
                      className="w-full accent-black"
                    />
                  </label>

                  <label className="block">
                    <span
                      className="mb-1 block font-black text-[var(--color-muted)]"
                      style={{ fontSize: administrationTypography.fieldLabel }}
                    >
                      AJUSTE VERTICAL
                    </span>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      step="2"
                      value={cropModalState.crop.offsetY}
                      onChange={(event) =>
                        handleCropValueChange({ offsetY: Number(event.target.value) })
                      }
                      className="w-full accent-black"
                    />
                  </label>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    className="h-11 border border-[var(--color-border)] bg-white px-4 font-black"
                    style={{ fontSize: administrationTypography.action }}
                    onClick={handleCloseCropModal}
                  >
                    CANCELAR
                  </button>
                  <button
                    type="button"
                    className="h-11 bg-[var(--color-lime)] px-4 font-black text-black"
                    style={{ fontSize: administrationTypography.action }}
                      onClick={handleApplyCrop}
                    disabled={isApplyingCrop}
                  >
                    {isApplyingCrop ? "ENVIANDO..." : "USAR RECORTE"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
