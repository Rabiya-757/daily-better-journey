import config from '../../site.config.mjs';

export const site = config;

/** Absolute URL for a path on the production site, e.g. absoluteUrl('/blog/') */
export function absoluteUrl(path = '/'): string {
  return new URL(path, config.siteUrl + '/').toString();
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const operatorName: string = config.privacy.operatorName || config.author.name;

/** Which "your details" pages have everything they need. Incomplete pages stay noindex and out of the sitemap. */
export const ready = {
  about: Boolean(config.author.name && config.author.bio.some(Boolean)),
  contact: emailPattern.test(config.contactEmail),
  privacy: Boolean(
    emailPattern.test(config.contactEmail) &&
      operatorName &&
      config.privacy.effectiveDate &&
      !Number.isNaN(Date.parse(config.privacy.effectiveDate)) &&
      (!config.privacy.usesAnalytics || config.privacy.analyticsName),
  ),
};

const adId = config.adsense.publisherId;
const validAdId = /^ca-pub-\d{10,20}$/.test(adId) && !/^ca-pub-0+$/.test(adId);

export const adsense = {
  /** Emit <meta name="google-adsense-account"> on every page. */
  verificationMeta: validAdId && config.adsense.verificationMeta,
  /** Load the ad script (article pages only). */
  loadScript: validAdId && config.adsense.loadAdScript,
  publisherId: adId,
};

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
