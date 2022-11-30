import de_DE from './de-DE';
import en_US from './en-US';

const availableLanguages = {
	en: 'English',
	de: 'Deutsch',
};

const pluralFormFor = (forms: string, count: number, locale: string) => {
  const matchingForm = new Intl.PluralRules(locale).select(count);
  return forms[matchingForm];
}

const __ = (locale: string, key: string, vars?: object, plural?: number):string => {
  const lang = locale.replace('_', '-');
  const translations: object = {de_DE, en_US};

  // if (typeof plural === 'number' && plural > 1) {
  //   // return translations[locale][`${key}--plural`][props.time > 1 ? 1 : 0];
  //   return pluralFormFor(translations[locale][`${key}--plural`], props.time, locale);
  // }
  //
  // console.log(vars);
  if (vars) {

    /**
     * [entries description]
     *
     * @param   {[type]}  variable  [variable description]
     * @param   {[type]}  value     [value description]
     *
     * @return  {string}                [return description]
     */
    for (const [variable, value] of Object.entries(vars)) {
      const regex = new RegExp(`{\\s*${variable}\\s*}`, 'gi');

      return translations[locale][key].replace(regex, value);
   }
  }



  return translations[locale][key] || key;
}

export {__, availableLanguages};
