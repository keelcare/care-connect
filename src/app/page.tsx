import { Hero } from "@/components/features/Hero";
import { FeaturedServices } from "@/components/features/FeaturedServices";
import { FeaturedCaregivers } from "@/components/features/FeaturedCaregivers";
import { Testimonials } from "@/components/features/Testimonials";
import { CTASection } from "@/components/features/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <FeaturedCaregivers />
      <Testimonials />
      <CTASection />
    </>
  );
}
