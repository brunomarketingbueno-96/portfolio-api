export const getProviderLogo = (providerType: string) => {
  switch (providerType) {
    case 'openai':
      return 'openai.png';
    case 'gemini':
      return 'gemini.png';
    case 'groq':
      return 'groq-ai.png';
    default:
      return 'default.svg';
  }
};