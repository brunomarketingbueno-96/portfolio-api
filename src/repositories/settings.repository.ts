import { db } from '../db/index.js';
import { settings } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Settings = typeof settings.$inferSelect;
type UpdateSettings = Partial<typeof settings.$inferInsert>;

export const findGlobalSettings = async (): Promise<Settings | undefined> => {
  return await db.query.settings.findFirst({
    with: { aiKeys: true }
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
