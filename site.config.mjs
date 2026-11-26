// ============================================================================
//  site.config.mjs  -  the ONE file you edit to make this site yours.
// ----------------------------------------------------------------------------
//  Anything left empty ("") is treated as "not provided yet":
//   - About, Contact and Privacy pages stay hidden from search engines and
//     out of sitemap.xml until their required fields are filled in.
//   - Nothing is invented for you: no names, bios, emails or ad IDs.
// ============================================================================

// ---- Production URL (single source of truth) -------------------------------
// Set SITE_URL in Cloudflare Pages (or in a local .env file). Examples:
//   https://YOUR-PROJECT.pages.dev     <- first launch
//   https://dailybetterjourney.com     <- after your domain works
// Load a local .env file if present (Node 20.12+/22). Variables already set by Cloudflare win.
try {
  process.loadEnvFile?.();
} catch {
  /* no .env file: fine */
}

const rawUrl = (process.env.SITE_URL || 'http://localhost:4321').trim();
export const siteUrl = rawUrl.replace(/\/+$/, '');

export default {
  siteName: 'Daily Better Journey',
  siteUrl,
  language: 'en',

  // Browser/search title of the home page (keep under ~60 characters).
  homeTitle: 'Daily Better Journey | Practical Productivity, Focus and Habits',

  // Used for the default meta description and social previews.
  tagline: 'Practical notes on productivity, focus, motivation and lasting habits.',
  description:
    'Daily Better Journey is a blog about practical productivity, focus, motivation and building habits you can keep.',

  // Home page hero text. Edit freely.
  heroTitle: 'Focus, motivation and habits you can keep.',
  heroText:
    'Daily Better Journey is a blog about practical productivity: small, repeatable changes you can try in your own week.',

  // ---- YOUR real author details (required before About page goes live) -----
  author: {
    name: '', // e.g. your real name or the name you publish under
    // One string per paragraph. Write only what is true.
    bio: [],
    // Optional: a real page about you (LinkedIn, personal site). Leave "" if none.
    url: '',
  },

  // Optional paragraph(s) on how you write/edit/correct articles. Leave [] if none.
  editorialNote: [],

  // ---- YOUR real contact email (required before Contact page goes live) ----
  contactEmail: '',

  // ---- Privacy policy facts (required before Privacy page goes live) -------
  privacy: {
    // Person or business that runs the site. Falls back to author.name.
    operatorName: '',
    // The date this policy text is true from, written like "2026-12-01".
    effectiveDate: '',
    // Set true ONLY if you switch on Cloudflare Web Analytics (or add any
    // analytics). The policy text changes accordingly. Update before enabling.
    usesAnalytics: false,
    // Name of the analytics tool if usesAnalytics is true, e.g. "Cloudflare Web Analytics".
    analyticsName: '',
    // Set true ONLY after you have set up consent messaging (see docs/ADSENSE-CHECKLIST.md)
    // and are ready to serve ads.
    consentConfirmed: false,
  },

  // ---- Google AdSense (OFF by default) --------------------------------------
  adsense: {
    // Your real publisher ID from AdSense, in the form "ca-pub-" followed by 16 digits.
    // Leave "" until Google shows it to you. Dummy IDs make the build fail.
    publisherId: '',
    // true = add <meta name="google-adsense-account"> to every page (ownership
    // verification, does NOT show ads). Needs publisherId.
    verificationMeta: false,
    // true = load Google's ad script on ARTICLE pages only (ads start serving once
    // Google approves the site). Needs publisherId. Keep false until approved and
    // consent messaging is configured.
    loadAdScript: false,
  },

  // ---- Google Search Console (optional) -----------------------------------------
  // If you verify with the "HTML tag" method, paste ONLY the content value Google gives
  // you (the long code inside content="..."). Leave "" to output nothing.
  searchConsoleVerification: '',

  // ---- Social sharing ---------------------------------------------------------
  // Default share image (1200x630 PNG in /public). Each article can override it
  // with `image:` in its front matter.
  socialImage: '/og-default.png',
  // Optional, like "@yourhandle". Leave "" if you have none.
  twitterHandle: '',
};
