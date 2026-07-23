import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
  },
}));

import {
  findUserByEmail,
  findUserById,
  updateLoginAttempts,
  resetLoginAttempts,
  updateUserProfile,
  updateUserPassword,
} from '../../repositories/users.repository.js';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

describe('Users Repository', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'https://avatar.com/test.png',
    passwordHash: 'hashed-password',
    loginAttempts: 0,
    lockUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should find and return user by email', async () => {
      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser);

      const result = await findUserByEmail('test@example.com');

      expect(db.query.users.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
        })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should find and return user by ID', async () => {
      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser);

      const result = await findUserById('user-123');

      expect(db.query.users.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
        })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateLoginAttempts', () => {
    it('should update login attempts and lockUntil and return the updated user', async () => {
      const lockDate = new Date();
      const updatedUser = { ...mockUser, loginAttempts: 3, lockUntil: lockDate };

      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateLoginAttempts('user-123', 3, lockDate);

      expect(db.update).toHaveBeenCalledWith(users);
      expect(mockUpdateChain.set).toHaveBeenCalledWith({ loginAttempts: 3, lockUntil: lockDate });
      expect(mockUpdateChain.where).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should return null if no user is updated', async () => {
      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateLoginAttempts('user-123', 3, null);

      expect(result).toBeNull();
    });
  });

  describe('resetLoginAttempts', () => {
    it('should reset login attempts and lockUntil to default values', async () => {
      const updatedUser = { ...mockUser, loginAttempts: 0, lockUntil: null };

      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await resetLoginAttempts('user-123');

      expect(db.update).toHaveBeenCalledWith(users);
      expect(mockUpdateChain.set).toHaveBeenCalledWith({ loginAttempts: 0, lockUntil: null });
      expect(mockUpdateChain.where).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should return null if no user is updated', async () => {
      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await resetLoginAttempts('user-123');

      expect(result).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    it('should update defined profile fields and return updated user', async () => {
      const updateData = { name: 'Updated Name', email: 'updated@example.com' };
      const updatedUser = { ...mockUser, ...updateData };

      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateUserProfile('user-123', updateData);

      expect(db.update).toHaveBeenCalledWith(users);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          email: 'updated@example.com',
          avatarUrl: undefined,
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toEqual(updatedUser);
    });

    it('should support resetting avatarUrl to null', async () => {
      const updateData = { avatarUrl: null };
      const updatedUser = { ...mockUser, avatarUrl: null };

      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateUserProfile('user-123', updateData);

      expect(mockUpdateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: undefined,
          email: undefined,
          avatarUrl: undefined,
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null if no user is updated', async () => {
      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateUserProfile('user-123', { name: 'Updated Name' });

      expect(result).toBeNull();
    });
  });

  describe('updateUserPassword', () => {
    it('should update user password hash', async () => {
      const updatedUser = { ...mockUser, passwordHash: 'new-hash' };

      const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateUserPassword('user-123', 'new-hash');

      expect(db.update).toHaveBeenCalledWith(users);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          passwordHash: 'new-hash',
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null if no user password is updated', async () => {
      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateUserPassword('user-123', 'new-hash');

      expect(result).toBeNull();
    });
  });
});
