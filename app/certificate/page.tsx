import type { Metadata } from "next";

import CertificateCarousel from "@/components/ui/certificate-carousel";
import Reveal from "@/components/ui/reveal";
import SitePage from "@/components/ui/site-page";
import { getCertificates, getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Koleksi sertifikat pelatihan dan keahlian Mochammad Ginata Febryansyah â€” Frontend Developer.",
};

export default async function CertificatePage() {
  const [certificates, data] = await Promise.all([getCertificates(), getPortfolioData()]);

  return (
    <SitePage variant="home" footerName={data.profile.name}>
      <Reveal>
        <div className="section-head">
          <div>
            <p className="section-index">Certificates</p>
            <h2 className="section-title">
              Proof of <span className="gradient-text">work</span>.
            </h2>
          </div>
          <p className="section-note">{certificates.length} sertifikat</p>
        </div>
      </Reveal>

      <Reveal delay={110} y={40}>
        <CertificateCarousel items={certificates} />
      </Reveal>
    </SitePage>
  );
}

