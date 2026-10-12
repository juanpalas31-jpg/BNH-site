export const TOILE_DOR_GALLERY_EXPERIENCE = Object.freeze({
  project: "TOILE_D_OR_VINTED",
  surface: "homepage_only",
  identity: "TOILE D'OR",
  mode: "art_gallery",
  artistsAreExhibits: true,
  preferVerifiedRealPosterPhotos: true,
  forbidFakeProductPhotography: true,
  soundtrack: {
    enabled: true,
    scope: "homepage_only",
    src: "/media/toile-dor-gallery-ambience.mp3",
    requiresPublishRights: true,
    respectBrowserAutoplayPolicy: true,
    userControlRequired: true
  },
  preserve: [
    "vinted_cta",
    "supabase_analytics",
    "vercel_analytics",
    "robots",
    "sitemap",
    "seo_pages"
  ],
  releaseGate: [
    "homepage_brand_verified",
    "real_images_verified",
    "audio_asset_and_rights_verified",
    "mobile_verified",
    "vinted_links_verified",
    "analytics_verified"
  ]
});

export function toileDorGalleryReleaseCheck(evidence = {}) {
  const missing = TOILE_DOR_GALLERY_EXPERIENCE.releaseGate.filter(key => evidence[key] !== true);
  return { ready: missing.length === 0, missing };
}