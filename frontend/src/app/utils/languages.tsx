import { languages } from "../../config/constants";
import i18n from "../../i18n";

export function setLanguage(displayLanguage: string) {
  i18n.changeLanguage(displayLanguage);
  document.documentElement.setAttribute("lang", displayLanguage);
}

export default function getI18nLanguages(): string[] {
  return languages.map((language) => {
    const translationKey = `languages.${language}`;

    return i18n.exists(translationKey) ? i18n.t(translationKey) : language;
  });
}
