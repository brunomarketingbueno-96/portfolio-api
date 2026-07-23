import { handleResponse } from "@/helpers/fetchHelpers";
import type { Profile, ChangePassword } from "@/typings/Profile";

export const UserService = {
  async updateProfile(payload: Partial<Profile>): Promise<Profile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    return handleResponse(res);
  },

  async updatePassword(payload: Pick<ChangePassword, 'oldPassword' | 'newPassword'>): Promise<Profile> {
    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    return handleResponse(res);
  }
};
