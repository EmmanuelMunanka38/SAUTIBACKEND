import { PrismaClient, Role } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const mbeyaTownWards = [
  { name: 'Iganjo', constituency: 'Mbeya Town' },
  { name: 'Ilembo', constituency: 'Mbeya Town' },
  { name: 'Itagano', constituency: 'Mbeya Town' },
  { name: 'Iwambi', constituency: 'Mbeya Town' },
  { name: 'Iyela', constituency: 'Mbeya Town' },
  { name: 'Mabatini', constituency: 'Mbeya Town' },
  { name: 'Maendeleo', constituency: 'Mbeya Town' },
  { name: 'Mwasenga', constituency: 'Mbeya Town' },
  { name: 'Nsoho', constituency: 'Mbeya Town' },
  { name: 'Ruanda', constituency: 'Mbeya Town' },
  { name: 'Sisya', constituency: 'Mbeya Town' },
  { name: 'Tembela', constituency: 'Mbeya Town' },
  { name: 'Uyole', constituency: 'Mbeya Town' },
];

async function main() {
  console.log('Seeding database...');

  for (const ward of mbeyaTownWards) {
    await prisma.ward.upsert({
      where: { name: ward.name },
      update: {},
      create: ward,
    });
  }
  console.log(`Seeded ${mbeyaTownWards.length} wards for Mbeya Town.`);

  const adminWard = await prisma.ward.findFirst({ where: { name: 'Iyela' } });

  if (adminWard) {
    const adminExists = await prisma.user.findUnique({
      where: { phoneNumber: '+255712000000' },
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          fullName: 'System Admin',
          phoneNumber: '+255712000000',
          role: Role.ADMIN,
          wardId: adminWard.id,
          isVerified: true,
        },
      });
      console.log('Created admin user: +255712000000');
    }
  }

  const mpWard = await prisma.ward.findFirst({ where: { name: 'Mabatini' } });

  if (mpWard) {
    const mpExists = await prisma.user.findUnique({
      where: { phoneNumber: '+255712000001' },
    });

    if (!mpExists) {
      await prisma.user.create({
        data: {
          fullName: 'Mbeya Town MP',
          phoneNumber: '+255712000001',
          role: Role.MP,
          wardId: mpWard.id,
          isVerified: true,
        },
      });
      console.log('Created MP user: +255712000001');
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
