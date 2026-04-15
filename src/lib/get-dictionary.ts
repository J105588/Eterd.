import type { Locale } from '../i18n-config';
import { jp } from '../dictionaries/jp';
import { en } from '../dictionaries/en';

const dictionaries = {
  jp,
  en,
};

export const getDictionary = async (locale: Locale) => dictionaries[locale] || dictionaries.jp;
