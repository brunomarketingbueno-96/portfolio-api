import 'dotenv-flow/config';
import { eq } from 'drizzle-orm';
import { db } from './index.js';
import { services, serviceTranslations } from './schema.js';

const servicesData = [
  {
    id: "becb4c31-1630-455c-8921-135cf9fc9d34",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783897993/projects/proj-becb4c31-1630-455c-8921-135cf9fc9d34.png",
    link: "https://github.com/brunomarketingbueno-96/escala-ecommerce",
    createdAt: new Date("2026-07-12T22:17:33.857Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Estruturação e Escala de E-commerce & Dropshipping", description: "Otimização completa de operações de e-commerce e dropshipping, focada em conversão, tráfego estratégico e crescimento previsível." },
      { language: "en", title: "E-commerce & Dropshipping Structuring and Scaling", description: "Complete e-commerce and dropshipping optimization focused on high conversion, strategic traffic, and predictable scaling." }
    ]
  },
  {
    id: "6a92c0b9-4708-4a37-8a33-6aa9da2362f9",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898052/projects/proj-6a92c0b9-4708-4a37-8a33-6aa9da2362f9.png",
    link: null,
    createdAt: new Date("2026-07-12T22:19:36.489Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Otimização de Processos e CRM para Clínicas", description: "Implementação de CRM e automações para clínicas, melhorando a experiência do paciente e aumentando a eficiência operacional." },
      { language: "en", title: "Process Optimization and CRM for Clinics", description: "Specialized CRM and automation solutions for clinics, enhancing patient experience and operational efficiency." }
    ]
  },
  {
    id: "70d2a531-5773-426d-af6f-631fd26333a8",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898132/projects/proj-70d2a531-5773-426d-af6f-631fd26333a8.png",
    link: null,
    createdAt: new Date("2026-07-12T22:21:38.483Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Desenvolvimento de Portfólio para Consultoria SAP", description: "Criação de portfólios corporativos de alta conversão para consultores e mentores, consolidando autoridade e captação de leads." },
      { language: "en", title: "Portfolio Development for SAP Consulting", description: "Development of high-converting professional portfolios for corporate consultants, focusing on digital authority and lead generation." }
    ]
  },
  {
    id: "50cd83ec-824e-4a9b-af4d-1cd2e959f903",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898161/projects/proj-50cd83ec-824e-4a9b-af4d-1cd2e959f903.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:50.501Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Transformação de E-book em Produto Perpétuo", description: "Transformação estratégica de e-books em produtos perpétuos, unindo funis de vendas automatizados e tráfego pago para escala." },
      { language: "en", title: "Transforming E-books into Evergreen Products", description: "Strategic transformation of e-books into evergreen digital products using automated sales funnels and optimized traffic." }
    ]
  },
  {
    id: "01f5ca36-2997-42a7-81e1-84ccf81e3593",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898200/projects/proj-01f5ca36-2997-42a7-81e1-84ccf81e3593.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:00.136Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Criação de Estoque Inteligente para Moda", description: "Metodologia proprietária de estoque inteligente para marcas de moda, reduzindo riscos de produção e otimizando margens." },
      { language: "en", title: "Smart Inventory Method for Fashion", description: "Proprietary smart inventory methodology for fashion brands, designed to minimize overproduction risks and optimize margins." }
    ]
  },
  {
    id: "1832fde2-98c0-406e-9a17-a8d0974a5021",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898232/projects/proj-1832fde2-98c0-406e-9a17-a8d0974a5021.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:34.749Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Gestão de Marketing para Estúdio de Moda", description: "Gestão estratégica para estúdios internacionais de moda, integrando branding, tráfego e expansão de mercado." },
      { language: "en", title: "Marketing Management for Fashion Studio", description: "Strategic marketing management for international fashion studios, integrating branding, paid traffic, and market expansion." }
    ]
  },
  {
    id: "f7699e2f-e5f1-4be8-8f8b-3bf78ff47fad",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898256/projects/proj-f7699e2f-e5f1-4be8-8f8b-3bf78ff47fad.png",
    link: null,
    createdAt: new Date("2026-07-12T22:19:18.194Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Lançamentos Digitais de Alta Performance", description: "Gestão completa de lançamentos digitais de alta performance com estratégias focadas em conversão e ROAS escalável." },
      { language: "en", title: "High-Performance Digital Launches", description: "Full-service management of high-performance digital launches, with conversion strategies focused on scalable ROAS." }
    ]
  },
  {
    id: "410a41e7-3c47-40b4-a195-31c0bce00140",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898297/projects/proj-410a41e7-3c47-40b4-a195-31c0bce00140.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:20.796Z"),
    updatedAt: new Date(),
    translations: [
      { language: "pt", title: "Consultoria em Marketing Digital para PMEs", description: "Consultoria estratégica para PMEs, focada em diagnóstico, comunicação personalizada e aumento sustentável de vendas." },
      { language: "en", title: "Digital Marketing Consulting for SMEs", description: "Strategic digital marketing consulting for SMEs, focusing on diagnosis, personalized communication, and sales growth." }
    ]
  }
];

async function seed() {
  console.log('🌱 Starting seed process...');

  try {
    for (const data of servicesData) {
      await db.insert(services)
        .values({
          id: data.id,
          imageUrl: data.imageUrl,
          link: data.link,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
        .onConflictDoUpdate({
          target: services.id,
          set: {
            imageUrl: data.imageUrl,
            link: data.link,
            updatedAt: new Date(),
          }
        });

      await db.delete(serviceTranslations)
        .where(eq(serviceTranslations.serviceId, data.id));

      for (const t of data.translations) {
        await db.insert(serviceTranslations)
          .values({
            serviceId: data.id,
            language: t.language,
            title: t.title,
            description: t.description,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }
      console.log(`✅ Synced service: ${data.id}`);
    }

    console.log('\n🚀 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
  } finally {
    process.exit(0);
  }
}

seed();