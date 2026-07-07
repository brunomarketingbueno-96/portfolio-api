interface BlogPost {
  id: string;
  coverImageUrl: string;
  isPublished: boolean;
  translations: { language: string; slug: string; title: string; excerpt: string; content: string }[];
}