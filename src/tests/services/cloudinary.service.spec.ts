import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    utils: {
      api_sign_request: vi.fn().mockReturnValue('mock-signature'),
    },
  },
}));

import { generateSignature } from '../../services/cloudinary.service.js';
import { v2 as cloudinary } from 'cloudinary';

describe('Cloudinary Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';
  });

  it('should generate signature correctly and slugify the publicId', () => {
    const folder = 'projects';
    const identifier = 'My Awesome Project!! áéíóú';

    const result = generateSignature(folder, identifier);

    expect(cloudinary.utils.api_sign_request).toHaveBeenCalledWith(
      {
        timestamp: expect.any(Number),
        public_id: 'projects/my-awesome-project-aeiou',
      },
      'test-secret'
    );

    expect(result).toEqual({
      cloudName: 'test-cloud',
      apiKey: 'test-key',
      timestamp: expect.any(Number),
      signature: 'mock-signature',
      publicId: 'projects/my-awesome-project-aeiou',
    });
  });
});
