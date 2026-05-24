import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import TrustStrip from '@/components/sections/TrustStrip';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import HostShowcase from '@/components/sections/HostShowcase';
import PricingTeaser from '@/components/sections/PricingTeaser';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import Download from '@/components/sections/Download';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <TrustStrip />
      <Features />
      <HowItWorks />
      <HostShowcase />
      <PricingTeaser />
      <Testimonials />
      <FAQ />
      <Download />
    </main>
  );
}
