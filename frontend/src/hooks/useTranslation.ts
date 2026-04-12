import { useAppStore } from '../store/appStore';
import { translations, Language } from '../i18n/translations';

export const useTranslation = () => {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  
  const t = translations[language];
  
  return {
    t,
    language,
    setLanguage,
  };
};
