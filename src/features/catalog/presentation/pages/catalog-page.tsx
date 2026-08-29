import { createCatalogProductsUseCase } from "@/core/di/catalog";
import { CatalogExperience } from "@/features/catalog/presentation/pages/catalog-experience";

export async function CatalogPage() {
  const result = await createCatalogProductsUseCase().call();

  if (!result.ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
        <p className="text-sm font-semibold">{result.failure.message}</p>
      </main>
    );
  }

  return <CatalogExperience products={result.data} />;
}
