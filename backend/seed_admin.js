const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      email: 'admin@college.edu',
      password: hashedPassword,
      profile: {
        create: {
          name: 'System Administrator',
          role: 'admin',
          status: 'active',
          department: 'Administration'
        }
      }
    },
    include: { profile: true }
  });

  console.log('✅ Default Admin Created:');
  console.log('   Email:    admin@college.edu');
  console.log('   Password: admin123');
  console.log('   Role:     admin');
  console.log('   Profile ID:', admin.profile?.id);
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
