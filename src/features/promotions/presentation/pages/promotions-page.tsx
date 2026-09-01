import type { StorePromotion } from "@/core/promotions/promotion";
import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import type { PromotionProductOption } from "@/features/promotions/presentation/viewmodels/promotions-view-state";
import { PromotionsExperience } from "@/features/promotions/presentation/pages/promotions-experience";

type PromotionsPageProps = {
  storeName: string;
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
  promotions: StorePromotion[];
  products: PromotionProductOption[];
};

export function PromotionsPage(props: PromotionsPageProps) {
  return <PromotionsExperience {...props} />;
}
