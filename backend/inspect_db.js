const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  const venues = await prisma.venue.findMany();
  const categories = await prisma.category.findMany();
  const users = await prisma.profile.findMany();
  
  console.log('Events Count:', events.length);
  console.log('Venues Count:', venues.length);
  console.log('Categories Count:', categories.length);
  console.log('Users Count:', users.length);
  
  if (events.length > 0) console.log('Sample Event:', events[0]);
}

main().catch(console.error).finally(() => prisma.$disconnect());
