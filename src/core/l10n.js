// @ts-check
/**
 * Module core/l10n
 *
 * Looks at the lang attribute on the root element and uses it
 * to manage the config.l10n object so that other parts of the system can
 * localize their text.
 */

export const name = "core/l10n";

const html = document.documentElement;
// Explicitly default lang and dir on <html> if not set.
// We assume English and ltr as default for international standards.
if (!html?.hasAttribute("lang")) {
  html.lang = "en";
  if (!html.hasAttribute("dir")) {
    html.dir = "ltr";
  }
}

export const l10n = {};

export const lang = html?.lang ?? "en";

export function run(config) {
  config.l10n = l10n[lang] || l10n.en;
}
