"use client";

import { ExploreWelcomeCard } from "@/src/widgets/explore/ui/ExploreWelcomeCard";
import { ExploreOverviewSection } from "@/src/widgets/explore-overview/ui/ExploreOverviewSection";

export function ExploreAuthenticatedView() {
  return (
    <>
      <ExploreWelcomeCard />
      <ExploreOverviewSection />
    </>
  );
}
