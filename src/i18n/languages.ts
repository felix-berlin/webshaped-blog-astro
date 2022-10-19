import de from './de'
import en from './en'

export default {
	en: 'English',
	de: 'Deutsch',
};

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}

export function __(key: string, locale: string) {
  const translations = {de, en};

  return translations[locale][key] || key;
}
