import { db } from '../db/index.js';
import { services, serviceTranslations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Service = typeof services.$inferSelect;
type ServiceTranslation = typeof serviceTranslations.$inferSelect;
type NewService = typeof services.$inferInsert;

export const findAllServices = async (): Promise<Array<Service & { translations: ServiceTranslation[] }>> => {
  return await db.query.services.findMany({
    with: {
      translations: true,
    },
  });
};

export const findServiceById = async (id: string): Promise<(Service & { translations: ServiceTranslation[] }) | undefined> => {
  return await db.query.services.findFirst({
    where: eq(services.id, id),
    with: {
      translations: true,
    },
  });
};

export const createServiceRecord = async (
  serviceData: NewService,
  translations: Omit<ServiceTranslation, 'id' | 'serviceId' | 'createdAt' | 'updatedAt'>[]
) => {
  return await db.transaction(async (tx) => {
    const insertedServices = await tx.insert(services).values(serviceData).returning();
    const service = insertedServices[0];

    if (!service) {
      throw new Error('Falha ao inserir o serviço principal no banco de dados.');
    }

    if (translations?.length) {
      await tx.insert(serviceTranslations).values(
        translations.map((t) => ({
          ...t,
          serviceId: service.id,
        }))
      );
    }

    return service;
  });
};

export const updateServiceRecord = async (
  id: string,
  serviceData: Partial<NewService>,
  translations: Omit<ServiceTranslation, 'id' | 'serviceId' | 'createdAt' | 'updatedAt'>[]
) => {
  await db.transaction(async (tx) => {
    await tx.update(services)
      .set({
        ...serviceData,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id));

    if (translations && Array.isArray(translations)) {
      await tx.delete(serviceTranslations).where(eq(serviceTranslations.serviceId, id));

      if (translations.length > 0) {
        await tx.insert(serviceTranslations).values(
          translations.map((t) => ({
            ...t,
            serviceId: id,
          }))
        );
      }
    }
  });
};

export const deleteServiceRecord = async (id: string) => {
  await db.delete(services).where(eq(services.id, id));
};
