# Toile d'Or — Gallery Experience Module

This module is the Attila-side contract for the Toile d'Or homepage only.

## Mission
- Brand the public homepage as **TOILE D'OR**, never as a single artist.
- Create a quiet premium art-gallery atmosphere: dark walls, gold accents, generous spacing, framed real poster photography when verified assets exist.
- Pink Floyd, Marilyn Monroe, Jim Morrison and other artists are exhibits/collections, not the site identity.
- Preserve Vinted CTAs, Supabase tracking, Vercel Analytics, robots and sitemap behavior.
- Do not apply the gallery soundtrack to SEO/article/product pages.

## Sound contract
Homepage control: `#gallerySound`.
Audio element: `#galleryAudio`.
Expected asset: `/media/toile-dor-gallery-ambience.mp3`.

Browsers can block unprompted audible autoplay. The homepage must therefore expose a clear one-tap control and never bypass browser autoplay policy. If playback is blocked or the asset is unavailable, the shop remains fully usable.

Only use audio that the owner has the rights to publish. Do not embed copyrighted commercial music without permission.

## Image contract
Real poster photos are preferred. Never replace missing real assets with a fake product photograph. If verified image assets are not present in the deployable repository, keep the gallery functional and mark the missing asset as a release blocker.

## Release gate
Before production: verify homepage identity, real image assets, audio asset/licence, mobile rendering, Vinted links, analytics, sitemap/robots, then deploy.