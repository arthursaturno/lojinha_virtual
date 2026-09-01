"use client";

import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

import type { StorePromotion } from "@/core/promotions/promotion";
import { createPromotionActions } from "@/core/di/promotions-browser";
import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { AdminSidebar } from "@/core/ui/components/admin-sidebar";
import { AppToast } from "@/core/ui/components/app-toast";
import { PromotionEditor } from "@/features/promotions/presentation/components/promotion-editor";
import { promotionKindLabel, type PromotionProductOption } from "@/features/promotions/presentation/viewmodels/promotions-view-state";
import { usePromotionsViewModel } from "@/features/promotions/presentation/viewmodels/use-promotions-viewmodel";

type PromotionsExperienceProps = { storeName: string; adminEmail: string; supabaseConfig: AdminAuthenticationBrowserConfig; promotions: StorePromotion[]; products: PromotionProductOption[] };

export function PromotionsExperience({ storeName, adminEmail, supabaseConfig, promotions, products }: PromotionsExperienceProps) {
  const actions = useMemo(() => createPromotionActions(supabaseConfig), [supabaseConfig]);
  const viewModel = usePromotionsViewModel(promotions, actions);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return <div className="min-h-screen bg-[#f7f7f5] md:grid" style={{ gridTemplateColumns: `minmax(${administrationLayout.sidebarDesktopWidth}, ${administrationLayout.sidebarDesktopWidth}) minmax(0, 1fr)` }}>
    <AdminSidebar storeName={storeName} adminEmail={adminEmail} supabaseConfig={supabaseConfig} activeSection="promotions" isMobileOpen={isMobileSidebarOpen} onOpenMobile={() => setIsMobileSidebarOpen(true)} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
    <main className="px-4 pb-8 pt-[72px] md:px-8 md:py-8"><span className="font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.eyebrow }}>ADMINISTRACAO</span><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-black" style={{ fontSize: "2rem" }}>Promocoes</h1><p className="mt-1 text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>Crie campanhas, ofertas e cupons para a sua loja.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{(["popup", "product_discount", "quantity_discount", "coupon", "free_shipping"] as const).map((kind) => <button key={kind} type="button" onClick={() => viewModel.actions.openNew(kind)} className="flex min-h-20 items-center justify-center gap-2 border border-[var(--color-foreground)] bg-white px-3 text-center font-black hover:bg-[var(--color-lime)]" style={{ fontSize: administrationTypography.action }}><FiPlus aria-hidden="true" />{promotionKindLabel[kind]}</button>)}</div><section className="mt-6 border border-[var(--color-border)] bg-white"><div className="border-b border-[var(--color-border)] px-4 py-4"><h2 className="font-black" style={{ fontSize: administrationTypography.sectionTitle }}>CAMPANHAS CADASTRADAS</h2></div>{viewModel.state.promotions.length ? <div className="divide-y divide-[var(--color-border)]">{viewModel.state.promotions.map((promotion) => <button key={promotion.id} type="button" onClick={() => viewModel.actions.openExisting(promotion)} className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 text-left hover:bg-[#fafaf8]"><div><strong className="block font-black" style={{ fontSize: administrationTypography.body }}>{promotion.internalName}</strong><span className="mt-1 block text-[var(--color-muted)]" style={{ fontSize: administrationTypography.caption }}>{promotionKindLabel[promotion.kind]}{promotion.isActive ? " · ATIVA" : " · PAUSADA"}</span></div><span className={promotion.isActive ? "bg-[var(--color-lime)] px-2 py-1 font-black" : "border border-[var(--color-border)] px-2 py-1 font-black"} style={{ fontSize: administrationTypography.caption }}>{promotion.isActive ? "ATIVA" : "PAUSADA"}</span></button>)}</div> : <p className="px-4 py-12 text-center text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>Nenhuma promocao cadastrada.</p>}</section></main>{viewModel.state.draft ? <PromotionEditor draft={viewModel.state.draft} products={products} saveStatus={viewModel.state.saveStatus} onClose={viewModel.actions.closeEditor} onSave={viewModel.actions.save} onDelete={viewModel.actions.remove} onChange={viewModel.actions.updateDraft} onProductRuleChange={viewModel.actions.updateProductRule} onCouponRuleChange={viewModel.actions.updateCouponRule} onImageUpload={viewModel.actions.uploadImage} /> : null}{viewModel.state.feedbackMessage ? <AppToast tone={viewModel.state.saveStatus === "failure" ? "error" : "success"} message={viewModel.state.feedbackMessage} onDismiss={viewModel.actions.dismissFeedback} /> : null}</div>;
}
