import { ImageResponse } from "next/og";

import { ogImageAlt, ogImageFonts, ogImageSize, renderOgImage } from "@/components/ui/og-image";

export const alt = ogImageAlt;
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(renderOgImage(), {
    ...size,
    fonts: ogImageFonts,
  });
}
