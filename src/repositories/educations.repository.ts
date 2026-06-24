import { db } from '../db/index.js';
import { education, educationTranslations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Education = typeof education.$inferSelect;
type EducationTranslation = typeof educationTranslations.$inferSelect;
type NewEducation = typeof education.$inferInsert;

export const findAllEducations = async (): Promise<Array<Education & { translations: EducationTranslation[] }>> => {
  return await db.query.education.findMany({
    with: {
      translations: true,
    },
  });
};

export const findEducationById = async (id: string): Promise<(Education & { translations: EducationTranslation[] }) | undefined> => {
  return await db.query.education.findFirst({
    where: eq(education.id, id),
    with: {
      translations: true,
    },
  });
};

export const createEducationRecord = async (
  educationData: NewEducation,
  translationsData: Omit<EducationTranslation, 'id' | 'educationId' | 'createdAt' | 'updatedAt'>[]
) => {
  return await db.transaction(async (tx) => {
    const insertedEducation = await tx.insert(education).values(educationData).returning();
    const eduRecord = insertedEducation[0];

    if (!eduRecord) {
      throw new Error('Falha ao inserir registro de educação no banco de dados.');
    }

    if (translationsData?.length) {
      await tx.insert(educationTranslations).values(
        translationsData.map((t) => ({
          ...t,
          educationId: eduRecord.id,
        }))
      );
    }

    return eduRecord;
  });
};

export const updateEducationRecord = async (
  id: string,
  educationData: Partial<NewEducation>,
  translationsData: Omit<EducationTranslation, 'id' | 'educationId' | 'createdAt' | 'updatedAt'>[]
) => {
  await db.transaction(async (tx) => {
    await tx.update(education)
      .set({
        ...educationData,
        updatedAt: new Date()
      })
      .where(eq(education.id, id));

    if (translationsData && Array.isArray(translationsData)) {
      await tx.delete(educationTranslations).where(eq(educationTranslations.educationId, id));

      if (translationsData.length > 0) {
        await tx.insert(educationTranslations).values(
          translationsData.map((t) => ({
            ...t,
            educationId: id,
          }))
        );
      }
    }
  });
};

export const deleteEducationRecord = async (id: string) => {
  await db.delete(education).where(eq(education.id, id));
};
