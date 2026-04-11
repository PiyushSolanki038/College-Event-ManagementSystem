const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Venues...');
  await prisma.venue.createMany({
    data: [
      { name: 'Grand Auditorium', location: 'Block A, 1st Floor', capacity: 500, facilities: 'AC, Projector, Sound System' },
      { name: 'Seminar Hall 1', location: 'Digital Block, 2nd Floor', capacity: 120, facilities: 'AC, Digital Board' },
      { name: 'Open Air Theatre', location: 'Main Grounds', capacity: 1500, facilities: 'Stage, Lighting' },
      { name: 'Conference Room', location: 'Admin Block', capacity: 50, facilities: 'AC, Mic' }
    ],
    skipDuplicates: true
  });

  console.log('Seeding Categories...');
  await prisma.category.createMany({
    data: [
      { name: 'Technical' }, { name: 'Cultural' }, { name: 'Sports' }, { name: 'Workshop' }, { name: 'Seminar' }
    ],
    skipDuplicates: true
  });

  const venues = await prisma.venue.findMany();
  const cats = await prisma.category.findMany();
  const users = await prisma.profile.findMany();
  const admin = users.find(u => u.role === 'admin');

  if (!admin) {
    console.log('No admin user found to associate events');
    return;
  }

  console.log(`Using Admin ID: ${admin.id}`);

  const sampleEvents = [
    {
      title: 'Quantum Computing Hackathon',
      description: 'A 24-hour challenge to solve institutional physics problems using quantum algorithms.',
      date: '2026-05-15',
      time: '09:00',
      maxCapacity: 100,
      status: 'approved',
      venueId: venues[0].id,
      categoryId: cats[0].id,
      organizerId: admin.id
    },
    {
      title: 'Annual Cultural Mosaic',
      description: 'An evening of performing arts, music, and institutional heritage celebrations.',
      date: '2026-06-20',
      time: '18:00',
      maxCapacity: 1000,
      status: 'approved',
      venueId: venues[2].id,
      categoryId: cats[1].id,
      organizerId: admin.id
    }
  ];

  for (const event of sampleEvents) {
    console.log(`Creating event: ${event.title}`);
    await prisma.event.create({ data: event });
  }

  console.log('Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
