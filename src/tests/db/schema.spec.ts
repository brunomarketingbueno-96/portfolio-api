import { describe, it, expect } from 'vitest';
import {
  users,
  projects,
  projectTranslations,
  githubStats,
  education,
  educationTranslations,
  services,
  serviceTranslations,
  settings,
} from '../../db/schema.js';

describe('Database Schema', () => {
  it('should define all schemas and tables correctly', () => {
    expect(users).toBeDefined();
    expect(projects).toBeDefined();
    expect(projectTranslations).toBeDefined();
    expect(githubStats).toBeDefined();
    expect(education).toBeDefined();
    expect(educationTranslations).toBeDefined();
    expect(services).toBeDefined();
    expect(serviceTranslations).toBeDefined();
    expect(settings).toBeDefined();
  });

  it('should execute inline foreign keys callbacks to ensure coverage', () => {
    const tables = [
      projectTranslations,
      githubStats,
      educationTranslations,
      serviceTranslations,
    ];

    for (const table of tables) {
      const symbols = Object.getOwnPropertySymbols(table);
      const fkSymbol = symbols.find(s => s.toString() === 'Symbol(drizzle:PgInlineForeignKeys)');
      expect(fkSymbol).toBeDefined();
      if (fkSymbol) {
        const foreignKeys = (table as any)[fkSymbol];
        expect(Array.isArray(foreignKeys)).toBe(true);
        expect(foreignKeys.length).toBeGreaterThan(0);
        for (const fk of foreignKeys) {
          expect(typeof fk.reference).toBe('function');
          const ref = fk.reference();
          expect(ref).toBeDefined();
          expect(ref.foreignColumns).toBeDefined();
        }
      }
    }
  });
});
