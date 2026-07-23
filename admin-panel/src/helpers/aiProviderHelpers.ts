export const getProviderLogo = (providerType: string) => {
  switch (providerType) {
    case 'openai':
      return '/public/openai.png';
    case 'gemini':
      return '/public/gemini.png';
    case 'groq':
      return '/public/groq-ai.png';
    default:
      return 'default.svg';
  }
};