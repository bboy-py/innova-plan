/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Les visuels sont pour l'instant des placeholders Unsplash.
    // Quand les vraies photos de chantier Innova Plan seront disponibles,
    // il suffira de les déposer dans /public/images et de mettre à jour src/data/media.ts.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
};
export default nextConfig;
