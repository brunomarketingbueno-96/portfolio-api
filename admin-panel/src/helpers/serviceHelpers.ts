import type { Service } from "@/typings/Services";

export const getServiceData = (service: Service, field: 'title' | 'description', currentLanguage: string) => {
  if (!service.translations || service.translations.length === 0) return null;

  const localeData = service.translations.find(t => t.language === currentLanguage);
  const translation = localeData ? localeData : service.translations[0];

  return translation[field] || null;
};
