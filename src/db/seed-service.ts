import 'dotenv-flow/config';
import { db } from './index.js';
import { services, serviceTranslations } from './schema.js';

const servicesData = [
  {
    id: "becb4c31-1630-455c-8921-135cf9fc9d34",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783897993/projects/proj-becb4c31-1630-455c-8921-135cf9fc9d34.png",
    link: "https://github.com/brunomarketingbueno-96/escala-ecommerce",
    createdAt: new Date("2026-07-12T22:17:33.857Z"),
    updatedAt: new Date("2026-07-12T23:13:14.374Z"),
    translations: [
      {
        language: "pt",
        title: "Estruturação e Escala de E-commerce & Dropshipping",
        description: "Implementação completa de operações de e-commerce e dropshipping, com foco em aumento de conversões e otimização de vendas. O serviço engloba desde a mineração estratégica de produtos e gestão de tráfego pago até o copywriting persuasivo e testes A/B de ofertas. Através de análise profunda de dados e gestão eficiente de campanhas, garanto um crescimento sustentável e previsível para a sua loja virtual.",
        createdAt: new Date("2026-07-12T23:13:14.373Z"),
        updatedAt: new Date("2026-07-12T23:13:14.373Z")
      },
      {
        language: "en",
        title: "E-commerce & Dropshipping Structuring and Scaling",
        description: "Complete implementation of e-commerce and dropshipping operations, focused on increasing conversions and optimizing sales. The service encompasses everything from strategic product mining and paid traffic management to persuasive copywriting and A/B offer testing. Through deep data analysis and efficient campaign management, I guarantee sustainable and predictable growth for your online store.",
        createdAt: new Date("2026-07-12T23:13:14.373Z"),
        updatedAt: new Date("2026-07-12T23:13:14.373Z")
      }
    ]
  },
  {
    id: "6a92c0b9-4708-4a37-8a33-6aa9da2362f9",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898052/projects/proj-6a92c0b9-4708-4a37-8a33-6aa9da2362f9.png",
    link: null,
    createdAt: new Date("2026-07-12T22:19:36.489Z"),
    updatedAt: new Date("2026-07-12T23:14:13.370Z"),
    translations: [
      {
        language: "pt",
        title: "Otimização de Processos e CRM para Clínicas",
        description: "Solução especializada para o setor de saúde (clínicas médicas e odontológicas) focada na melhoria da experiência do paciente e aumento da eficiência operacional. O projeto inclui a implementação de sistemas de agendamento online, automação de atendimento via WhatsApp e integração com softwares médicos. O resultado é um atendimento mais ágil, redução de faltas e aumento no faturamento da clínica.",
        createdAt: new Date("2026-07-12T23:14:13.369Z"),
        updatedAt: new Date("2026-07-12T23:14:13.369Z")
      },
      {
        language: "en",
        title: "Process Optimization and CRM for Clinics",
        description: "Specialized solution for the healthcare sector (medical and dental clinics) focused on improving patient experience and increasing operational efficiency. The project includes the implementation of online scheduling systems, WhatsApp customer service automation, and integration with medical software. The result is more agile service, reduced no-shows, and increased clinic revenue.",
        createdAt: new Date("2026-07-12T23:14:13.369Z"),
        updatedAt: new Date("2026-07-12T23:14:13.369Z")
      }
    ]
  },
  {
    id: "70d2a531-5773-426d-af6f-631fd26333a8",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898132/projects/proj-70d2a531-5773-426d-af6f-631fd26333a8.png",
    link: null,
    createdAt: new Date("2026-07-12T22:21:38.483Z"),
    updatedAt: new Date("2026-07-12T23:15:33.232Z"),
    translations: [
      {
        language: "pt",
        title: "Desenvolvimento de Portfólio para Consultoria SAP",
        description: "Criação de porrfólio profissional de alta conversão para consultores e mentores corporativos. O projeto foca em consolidar a autoridade digital do profissional, utilizando design moderno e técnicas de CRO (Otimização da Taxa de Conversão). A estrutura é pensada para captar leads qualificados e apresentar os serviços de forma clara e persuasiva.",
        createdAt: new Date("2026-07-12T23:15:33.231Z"),
        updatedAt: new Date("2026-07-12T23:15:33.231Z")
      },
      {
        language: "en",
        title: "Portfolio Development for SAP Consulting",
        description: "Creation of a high-converting professional portfolio for corporate consultants and mentors. The project focuses on consolidating the professional's digital authority, using modern design and CRO (Conversion Rate Optimization) techniques. The structure is designed to capture qualified leads and present services clearly and persuasively.",
        createdAt: new Date("2026-07-12T23:15:33.231Z"),
        updatedAt: new Date("2026-07-12T23:15:33.231Z")
      }
    ]
  },
  {
    id: "50cd83ec-824e-4a9b-af4d-1cd2e959f903",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898161/projects/proj-50cd83ec-824e-4a9b-af4d-1cd2e959f903.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:50.501Z"),
    updatedAt: new Date("2026-07-12T23:16:02.823Z"),
    translations: [
      {
        language: "pt",
        title: "Transformação de E-book em Produto Perpétuo de Alta Rentabilidade",
        description: "Projeto especializado em transformar e-books e conteúdos digitais em produtos de venda contínua e altamente rentáveis. Atuei em todos os processos de um produto perpétuo (venda 100% online, todos os dias), resultando em faturamento de mais de R$ 150 mil em apenas 3 meses. O serviço inclui estruturação de funis de vendas, automação de processos e otimização de conversão.",
        createdAt: new Date("2026-07-12T23:16:02.822Z"),
        updatedAt: new Date("2026-07-12T23:16:02.822Z")
      },
      {
        language: "en",
        title: "Transforming E-books into Highly Profitable Evergreen Products",
        description: "Specialized project transforming e-books and digital content into continuous-selling, highly profitable products. I handled all processes for an evergreen product (100% online sales, every day), resulting in over R$ 150k in revenue in just 3 months. The service includes structuring sales funnels, process automation, and conversion optimization.",
        createdAt: new Date("2026-07-12T23:16:02.822Z"),
        updatedAt: new Date("2026-07-12T23:16:02.822Z")
      }
    ]
  },
  {
    id: "01f5ca36-2997-42a7-81e1-84ccf81e3593",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898200/projects/proj-01f5ca36-2997-42a7-81e1-84ccf81e3593.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:00.136Z"),
    updatedAt: new Date("2026-07-12T23:16:41.028Z"),
    translations: [
      {
        language: "pt",
        title: "Criação do Método de Estoque Inteligente para Moda",
        description: "Desenvolvimento de uma metodologia proprietária que permite às marcas de moda online ter controle estratégico de estoque antes de produzir em grande quantidade. O método reduz drasticamente o risco de sobreprodução e perdas financeiras, otimizando a relação entre demanda prevista e volume produzido. Essa abordagem inovadora gerou múltiplas consultorias e projetos de expansão para clientes.",
        createdAt: new Date("2026-07-12T23:16:41.028Z"),
        updatedAt: new Date("2026-07-12T23:16:41.028Z")
      },
      {
        language: "en",
        title: "Creation of the Smart Inventory Method for Fashion",
        description: "Development of a proprietary methodology that allows online fashion brands to maintain strategic inventory control before mass production. The method drastically reduces the risk of overproduction and financial losses by optimizing the relationship between forecasted demand and produced volume. This innovative approach has generated multiple consulting and expansion projects for clients.",
        createdAt: new Date("2026-07-12T23:16:41.028Z"),
        updatedAt: new Date("2026-07-12T23:16:41.028Z")
      }
    ]
  },
  {
    id: "1832fde2-98c0-406e-9a17-a8d0974a5021",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898232/projects/proj-1832fde2-98c0-406e-9a17-a8d0974a5021.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:34.749Z"),
    updatedAt: new Date("2026-07-12T23:17:13.980Z"),
    translations: [
      {
        language: "pt",
        title: "Gestão de Marketing para Estúdio de Moda Internacional",
        description: "Gestão estratégica de marketing para um estúdio de moda que atende mais de dez países, trabalhando com dezenas de marcas em centenas de projetos. O escopo inclui criação de sites para marcas, consultoria em vendas online, branding de moda, gestão de tráfego pago e desenvolvimento de planos de negócios. Resultado: potencialização de marcas nacionais e internacionais com presença digital consolidada.",
        createdAt: new Date("2026-07-12T23:17:13.979Z"),
        updatedAt: new Date("2026-07-12T23:17:13.979Z")
      },
      {
        language: "en",
        title: "Marketing Management for International Fashion Studio",
        description: "Strategic marketing management for a fashion studio serving over ten countries, collaborating with dozens of brands across hundreds of projects. The scope includes building brand websites, online sales consulting, fashion branding, paid traffic management, and business plan development. Result: empowering national and international brands with a consolidated digital presence.",
        createdAt: new Date("2026-07-12T23:17:13.979Z"),
        updatedAt: new Date("2026-07-12T23:17:13.979Z")
      }
    ]
  },
  {
    id: "f7699e2f-e5f1-4be8-8f8b-3bf78ff47fad",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898256/projects/proj-f7699e2f-e5f1-4be8-8f8b-3bf78ff47fad.png",
    link: null,
    createdAt: new Date("2026-07-12T22:19:18.194Z"),
    updatedAt: new Date("2026-07-12T23:17:37.946Z"),
    translations: [
      {
        language: "pt",
        title: "Lançamentos Digitais de Alta Performance",
        description: "Gestão e operação de lançamentos de infoprodutos com histórico comprovado de ROAS (Retorno sobre Investimento em Anúncios) positivo, alcançando em alguns casos picos de até 30x o valor investido. O serviço cobre toda a esteira do lançamento, desde a captação de leads e aquecimento de público até a gestão de grupos de WhatsApp e estratégias de conversão. Ideal para especialistas que desejam escalar seus produtos digitais com segurança e previsibilidade.",
        createdAt: new Date("2026-07-12T23:17:37.946Z"),
        updatedAt: new Date("2026-07-12T23:17:37.946Z")
      },
      {
        language: "en",
        title: "High-Performance Digital Launches",
        description: "Management and operation of info-product launches with a proven track record of positive ROAS (Return on Ad Spend), reaching peaks of up to 30x the invested amount in some cases. The service covers the entire launch pipeline, from lead generation and audience warming to WhatsApp group management and conversion strategies. Ideal for experts looking to scale their digital products safely and predictably.",
        createdAt: new Date("2026-07-12T23:17:37.946Z"),
        updatedAt: new Date("2026-07-12T23:17:37.946Z")
      }
    ]
  },
  {
    id: "410a41e7-3c47-40b4-a195-31c0bce00140",
    imageUrl: "https://res.cloudinary.com/rljreiqm/image/upload/v1783898297/projects/proj-410a41e7-3c47-40b4-a195-31c0bce00140.png",
    link: null,
    createdAt: new Date("2026-07-12T22:20:20.796Z"),
    updatedAt: new Date("2026-07-12T23:18:18.463Z"),
    translations: [
      {
        language: "pt",
        title: "Consultoria em Marketing Digital para PMEs",
        description: "Capacitação e consultoria estratégica para pequenas e médias empresas que buscam expandir sua presença digital e aumentar vendas. O serviço abrange diagnóstico de presença digital, estratégias de comunicação personalizadas para diversos segmentos e implementação de campanhas de tráfego pago. Trabalhei com empresas atendidas pelo SEBRAE, gerando resultados mensuráveis em presença digital e faturamento.",
        createdAt: new Date("2026-07-12T23:18:18.462Z"),
        updatedAt: new Date("2026-07-12T23:18:18.462Z")
      },
      {
        language: "en",
        title: "Digital Marketing Consulting for SMEs",
        description: "Training and strategic consulting for small and medium-sized enterprises seeking to expand their digital presence and increase sales. The service encompasses digital presence diagnosis, personalized communication strategies across various segments, and the implementation of paid traffic campaigns. I have worked with companies supported by SEBRAE, delivering measurable results in digital presence and overall revenue.",
        createdAt: new Date("2026-07-12T23:18:18.462Z"),
        updatedAt: new Date("2026-07-12T23:18:18.462Z")
      }
    ]
  }
];

async function seed() {
  console.log('🌱 Iniciando processo de seed de serviços e traduções...');

  try {
    for (const data of servicesData) {
      console.log(`\n⏳ Processando serviço: ${data.id}`);

      // 1. Inserir o Serviço Base
      await db.insert(services)
        .values({
          id: data.id,
          imageUrl: data.imageUrl,
          link: data.link,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
        .onConflictDoNothing({ target: services.id });

      console.log(`✅ Serviço base criado/verificado: ${data.id}`);

      // 2. Inserir as Traduções Vinculadas
      for (const t of data.translations) {
        await db.insert(serviceTranslations)
          .values({
            serviceId: data.id,
            language: t.language,
            title: t.title,
            description: t.description,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
          })
          // Como não definimos uma restrição única explícita na combinação (serviceId, language) 
          // no seu schema acima, a inserção padrão do drizzle prosseguirá. 
          // Recomendo ter um limite de segurança se for rodar o seed múltiplas vezes, 
          // mas isso insere os dados rigorosamente como pedido.
          .execute();

        console.log(`   🌍 Tradução [${t.language.toUpperCase()}] inserida com sucesso.`);
      }
    }

    console.log('\n🚀 Seed de serviços finalizado com sucesso!');

  } catch (error) {
    console.error('❌ Erro inesperado ao rodar o seed de serviços:');
    console.error(error);
  } finally {
    process.exit(0);
  }
}

seed();