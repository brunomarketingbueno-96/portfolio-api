import { db } from '../db/index.js';
import { aiProviders } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

type AiProvider = typeof aiProviders.$inferSelect;
type NewAiProvider = typeof aiProviders.$inferInsert;

export const createAiProviderRecord = async (data: NewAiProvider) => {
  const [provider] = await db.insert(aiProviders).values(data).returning();

  if (!provider) return null;

  return provider;
};

export const updateAiProviderRecord = async (
  id: string,
  data: Partial<AiProvider>
) => {
  const [provider] = await db.update(aiProviders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(aiProviders.id, id))
    .returning();

  if (!provider) return null;

  return provider;
};

export const deleteAiProviderRecord = async (id: string) => {
  const [provider] = await db.delete(aiProviders)
    .where(eq(aiProviders.id, id))
    .returning({ id: aiProviders.id });

  if (!provider) return null;

  return provider;
};
