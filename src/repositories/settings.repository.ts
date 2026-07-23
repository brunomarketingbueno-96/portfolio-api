import { db } from '../db/index.js';
import { settings, aiProviders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Settings = typeof settings.$inferSelect;
type UpdateSettings = Partial<typeof settings.$inferInsert>;
type AiProvider = typeof aiProviders.$inferSelect;

export type SafeAiProvider = Pick<AiProvider, 'id' | 'name' | 'provider' | 'isActive'>;

export const findGlobalSettings = async (): Promise<(Settings & { aiKeys: SafeAiProvider[] }) | undefined> => {
  return await db.query.settings.findFirst({
    with: {
      aiKeys: {
        columns: {
          id: true,
          name: true,
          provider: true,
          isActive: true,
        }
      }
    }
  });
};

export const updateGlobalSettingsRecord = async (
  id: string,
  settingsData: UpdateSettings
) => {
  const [updatedSettings] = await db.update(settings)
    .set({ ...settingsData, updatedAt: new Date() })
    .where(eq(settings.id, id))
    .returning();

  if (!updatedSettings) return null;

  return updatedSettings;
};
