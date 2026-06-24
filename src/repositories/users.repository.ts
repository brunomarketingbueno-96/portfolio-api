import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type User = typeof users.$inferSelect;

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
};

export const updateLoginAttempts = async (
  userId: string,
  attempts: number,
  lockUntil: Date | null
): Promise<void> => {
  await db.update(users)
    .set({ loginAttempts: attempts, lockUntil })
    .where(eq(users.id, userId));
};

export const resetLoginAttempts = async (userId: string): Promise<void> => {
  await db.update(users)
    .set({ loginAttempts: 0, lockUntil: null })
    .where(eq(users.id, userId));
};
