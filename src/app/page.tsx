import { Hero } from "@/components/features/Hero";
import { FeaturedServices } from "@/components/features/FeaturedServices";
import { TrustedBy } from "@/components/features/TrustedBy";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <FeaturedServices />
    </>
  );
}
