import 'dotenv-flow/config';
import { db } from './index.js';
import { users, settings } from './schema.js';
import * as bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Iniciando processo de seed...');

  console.log('👤 Verificando usuário administrador...');
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Erro: ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.insert(users)
      .values({
        email,
        passwordHash,
      })
      .onConflictDoNothing({ target: users.email });

    console.log(`✅ Admin processado: ${email}`);

    console.log('⚙️ Verificando configurações iniciais do painel...');

    const existingSettings = await db.select().from(settings).limit(1);

    if (existingSettings.length === 0) {
      await db.insert(settings).values({
        theme: 'system',
        panelLanguage: 'en',
      });
      console.log('✅ Configurações iniciais criadas com sucesso!');
    } else {
      console.log('💡 Configurações globais já existem. Nenhuma alteração feita.');
    }

    console.log('🚀 Seed finalizado com sucesso!');

  } catch (error) {
    console.error('❌ Erro inesperado ao rodar o seed:');
    console.error(error);
  } finally {
    process.exit(0);
  }
}

seed();
