"use client";

import { ExploreSearchAndFilters } from "@/src/widgets/explore-search/ui/ExploreSearchAndFilters";

export function ExploreGuestView() {
  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <ExploreSearchAndFilters />
    </section>
  );
}
