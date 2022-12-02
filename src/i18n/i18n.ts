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

const __ = (locale: string, translationString: string, varsToReplace?: object, plural?: number):string => {
  const lang = locale.replace('_', '-');
  const translations: object = {de_DE, en_US};

  // if (typeof plural === 'number' && plural > 1) {
  //   // return translations[locale][`${key}--plural`][props.time > 1 ? 1 : 0];
  //   return pluralFormFor(translations[locale][`${key}--plural`], props.time, locale);
  // }
  //
  // console.log(vars);
  if (varsToReplace) {

    /**
     * [entries description]
     *
     * @param   {[type]}  variable  [variable description]
     * @param   {[type]}  value     [value description]
     *
     * @return  {string}                [return description]
     */
    const regex = new RegExp(`\\{\\s*(${Object.keys(varsToReplace).join("|")})\\s*\\}`, 'gi');

    return translations[locale as keyof typeof translations][translationString].replace(regex, (matched:string, offset:number, string:string) => {

        return varsToReplace[offset as keyof typeof varsToReplace];
    });
  }



  return translations[locale as keyof typeof translations][translationString] || translationString;
}

export { __, availableLanguages };
