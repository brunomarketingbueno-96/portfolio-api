import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGithubProjectStats } from '../../services/github.service.js';

describe('Github Service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    process.env.GITHUB_KEY = 'mock-github-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return null and log error if repoUrl is invalid', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await fetchGithubProjectStats('https://gitlab.com/owner/repo');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('URL inválida ou não é do GitHub'));
    consoleSpy.mockRestore();
  });

  it('should return github stats successfully', async () => {
    const mockInfo = {
      stargazers_count: 42,
      topics: ['node', 'typescript'],
    };
    const mockLangs = {
      TypeScript: 1000,
      JavaScript: 500,
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockInfo,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLangs,
      } as Response);

    const result = await fetchGithubProjectStats('https://github.com/owner/repo.git');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      'https://api.github.com/repos/owner/repo',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'token mock-github-key',
        }),
      })
    );
    expect(result).toEqual({
      stars: 42,
      topics: ['node', 'typescript'],
      languages: ['TypeScript', 'JavaScript'],
    });
  });

  it('should return default empty topics if topics is not present in repo info', async () => {
    const mockInfo = {
      stargazers_count: 5,
    };
    const mockLangs = {
      CSS: 100,
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockInfo,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLangs,
      } as Response);

    const result = await fetchGithubProjectStats('https://github.com/owner/repo');

    expect(result).toEqual({
      stars: 5,
      topics: [],
      languages: ['CSS'],
    });
  });

  it('should return null and log error if fetch response is not ok', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: false,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

    const result = await fetchGithubProjectStats('https://github.com/owner/repo');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Erro ao buscar dados do GitHub'));
    consoleSpy.mockRestore();
  });

  it('should return null and log error if fetch throws an error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(fetch).mockRejectedValue(new Error('Network failure'));

    const result = await fetchGithubProjectStats('https://github.com/owner/repo');

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Erro na função fetchGithubProjectStats:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
