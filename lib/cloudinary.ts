// Helpers pour transformer les URLs Cloudinary automatiquement

export function optimizeImage(
  url: string,
  options: {
    width?:   number;
    height?:  number;
    quality?: number;
    format?:  "auto" | "webp" | "jpg" | "png";
    crop?:    "fill" | "fit" | "thumb" | "scale";
  } = {}
): string {
  if (!url?.includes("cloudinary.com")) return url;

  const {
    width,
    height,
    quality = "auto",
    format  = "auto",
    crop    = "fill",
  } = options;

  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
  ];

  if (width)  transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  // Insère les transformations dans l'URL Cloudinary
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export function getAvatarUrl(url: string, size = 96): string {
  return optimizeImage(url, { width: size, height: size, crop: "thumb" });
}

export function getCoverUrl(url: string, width = 400): string {
  return optimizeImage(url, { width, crop: "fill" });
}

export function getAudioWaveformUrl(publicId: string): string {
  // Génère une image de waveform depuis Cloudinary
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/video/upload/fl_waveform,co_white,b_transparent/${publicId}.png`;
}