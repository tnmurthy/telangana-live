import type { Metadata } from "next";
import DistrictDashboard from "@/components/DistrictDashboard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const areaName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${areaName} News & Local Updates | Telangana.live`,
    description: `Get real-time civic updates, water timings, power alerts, and local news for ${areaName}, Telangana. Pulse-monitored hyper-local intelligence.`,
    openGraph: {
      title: `${areaName} Local Command Center`,
      description: `Live civic dashboard for ${areaName} citizens.`,
      url: `https://telangana.live/${slug}`,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DistrictDashboard slug={slug} />;
}
