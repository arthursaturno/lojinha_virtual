import { redirect } from "next/navigation";

import { appRoutes } from "@/core/router/app-routes";

export default function AdminDashboardRoute() {
  redirect(appRoutes.adminProducts);
}
