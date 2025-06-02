import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar culturas padrão
  const cultures = await Promise.all([
    prisma.culture.upsert({
      where: { name: 'Soja' },
      update: {},
      create: { name: 'Soja' },
    }),
    prisma.culture.upsert({
      where: { name: 'Milho' },
      update: {},
      create: { name: 'Milho' },
    }),
    prisma.culture.upsert({
      where: { name: 'Algodão' },
      update: {},
      create: { name: 'Algodão' },
    }),
    prisma.culture.upsert({
      where: { name: 'Café' },
      update: {},
      create: { name: 'Café' },
    }),
    prisma.culture.upsert({
      where: { name: 'Cana de Açúcar' },
      update: {},
      create: { name: 'Cana de Açúcar' },
    }),
  ]);

  // Criar safras padrão
  const harvests = await Promise.all([
    prisma.harvest.upsert({
      where: { name: 'Safra 2023' },
      update: {},
      create: { name: 'Safra 2023', year: 2023 },
    }),
    prisma.harvest.upsert({
      where: { name: 'Safra 2024' },
      update: {},
      create: { name: 'Safra 2024', year: 2024 },
    }),
  ]);

  // Criar produtores de exemplo
  const producers = await Promise.all([
    prisma.producer.upsert({
      where: { document: '12345678901' },
      update: {},
      create: {
        name: 'João Silva Santos',
        document: '12345678901',
      },
    }),
    prisma.producer.upsert({
      where: { document: '98765432100' },
      update: {},
      create: {
        name: 'Maria Oliveira Costa',
        document: '98765432100',
      },
    }),
    prisma.producer.upsert({
      where: { document: '12345678000195' },
      update: {},
      create: {
        name: 'Agropecuária Boa Vista LTDA',
        document: '12345678000195',
      },
    }),
  ]);

  // Criar fazendas de exemplo
  const farms = await Promise.all([
    prisma.farm.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        producerId: producers[0].id,
        name: 'Fazenda Santa Rita',
        city: 'Ribeirão Preto',
        state: 'SP',
        totalArea: 1000.0,
        arableArea: 800.0,
        vegetationArea: 200.0,
      },
    }),
    prisma.farm.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        producerId: producers[1].id,
        name: 'Fazenda Boa Esperança',
        city: 'Uberlândia',
        state: 'MG',
        totalArea: 1500.0,
        arableArea: 1200.0,
        vegetationArea: 300.0,
      },
    }),
    prisma.farm.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440003' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        producerId: producers[2].id,
        name: 'Fazenda Águas Claras',
        city: 'Campo Grande',
        state: 'MS',
        totalArea: 2500.0,
        arableArea: 2000.0,
        vegetationArea: 500.0,
      },
    }),
  ]);

  // Criar associações de culturas com fazendas
  await Promise.all([
    // Fazenda Santa Rita - Safra 2024
    prisma.farmCulture.upsert({
      where: {
        farmId_cultureId_harvestId: {
          farmId: farms[0].id,
          cultureId: cultures[0].id, // Soja
          harvestId: harvests[1].id, // Safra 2024
        },
      },
      update: {},
      create: {
        farmId: farms[0].id,
        cultureId: cultures[0].id,
        harvestId: harvests[1].id,
      },
    }),
    prisma.farmCulture.upsert({
      where: {
        farmId_cultureId_harvestId: {
          farmId: farms[0].id,
          cultureId: cultures[1].id, // Milho
          harvestId: harvests[1].id, // Safra 2024
        },
      },
      update: {},
      create: {
        farmId: farms[0].id,
        cultureId: cultures[1].id,
        harvestId: harvests[1].id,
      },
    }),
    // Fazenda Boa Esperança - Safra 2024
    prisma.farmCulture.upsert({
      where: {
        farmId_cultureId_harvestId: {
          farmId: farms[1].id,
          cultureId: cultures[3].id, // Café
          harvestId: harvests[1].id, // Safra 2024
        },
      },
      update: {},
      create: {
        farmId: farms[1].id,
        cultureId: cultures[3].id,
        harvestId: harvests[1].id,
      },
    }),
    // Fazenda Águas Claras - Safra 2024
    prisma.farmCulture.upsert({
      where: {
        farmId_cultureId_harvestId: {
          farmId: farms[2].id,
          cultureId: cultures[4].id, // Cana de Açúcar
          harvestId: harvests[1].id, // Safra 2024
        },
      },
      update: {},
      create: {
        farmId: farms[2].id,
        cultureId: cultures[4].id,
        harvestId: harvests[1].id,
      },
    }),
    prisma.farmCulture.upsert({
      where: {
        farmId_cultureId_harvestId: {
          farmId: farms[2].id,
          cultureId: cultures[0].id, // Soja
          harvestId: harvests[1].id, // Safra 2024
        },
      },
      update: {},
      create: {
        farmId: farms[2].id,
        cultureId: cultures[0].id,
        harvestId: harvests[1].id,
      },
    }),
  ]);

  console.log('✅ Seed executado com sucesso!');
  console.log(`📊 Criados: ${cultures.length} culturas, ${harvests.length} safras, ${producers.length} produtores, ${farms.length} fazendas`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 