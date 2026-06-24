interface ServiceTranslation {
  language: string;
  title: string;
  description: string;
}

interface Service {
  id?: string;
  link: string | null;
  imageUrl: string | null;
  translations: ServiceTranslation[];
  createdAt?: string;
  updatedAt?: string;
}
