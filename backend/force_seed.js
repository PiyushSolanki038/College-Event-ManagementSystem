const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Institutional Seeding Commencing ---');
    
    // 1. Seed Venues
    const venuesData = [
        { name: 'Grand Auditorium', location: 'Block A, 1st Floor', capacity: 500, facilities: 'AC, Projector, Sound System' },
        { name: 'Seminar Hall 1', location: 'Digital Block, 2nd Floor', capacity: 120, facilities: 'AC, Digital Board' },
        { name: 'Open Air Theatre', location: 'Main Grounds', capacity: 1500, facilities: 'Stage, Lighting' },
        { name: 'Conference Room', location: 'Admin Block', capacity: 50, facilities: 'AC, Mic' }
    ];
    for (const v of venuesData) {
        await prisma.venue.upsert({ where: { name: v.name }, update: v, create: v });
    }
    console.log('Venues synced.');

    // 2. Seed Categories
    const catsData = [
        { name: 'Technical' }, { name: 'Cultural' }, { name: 'Sports' }, { name: 'Workshop' }, { name: 'Seminar' }
    ];
    for (const c of catsData) {
        await prisma.category.upsert({ where: { name: c.name }, update: c, create: c });
    }
    console.log('Categories synced.');

    // 3. Profiles
    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockOrg = await prisma.user.upsert({
        where: { email: 'organizer@aura.edu' },
        update: {},
        create: {
            email: 'organizer@aura.edu',
            password: hashedPassword,
            profile: { create: { name: 'Dr. Sarah Smith', role: 'organizer', status: 'active' } }
        },
        include: { profile: true }
    });
    console.log('Mock Organizer created.');

    const venues = await prisma.venue.findMany();
    const cats = await prisma.category.findMany();

    // 4. Events
    const count = await prisma.event.count();
    if (count <= 3) {
        const sampleEvents = [
            {
                title: 'Quantum Computing Hackathon',
                description: 'A 24-hour challenge to solve institutional physics problems using quantum algorithms.',
                date: new Date('2026-05-15T09:00:00Z'), time: '09:00', maxCapacity: 100, status: 'approved',
                venueId: venues[0].id, categoryId: cats[0].id, organizerId: 3,
                bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'
            },
            {
                title: 'Annual Cultural Mosaic',
                description: 'An evening of performing arts, music, and institutional heritage celebrations.',
                date: new Date('2026-06-20T18:00:00Z'), time: '18:00', maxCapacity: 1000, status: 'approved',
                venueId: venues[2].id, categoryId: cats[1].id, organizerId: 3,
                bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
            },
            {
                title: 'Robotics Workshop 2.0',
                description: 'Hands-on session for building autonomous institutional delivery drones.',
                date: new Date('2026-04-25T10:00:00Z'), time: '10:00', maxCapacity: 50, status: 'pending',
                venueId: venues[1].id, categoryId: cats[3].id, organizerId: 3,
                bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'
            },
            {
                title: 'Inter-disciplinary AI Seminar',
                description: 'Future trends in machine learning across institutional faculty disciplines.',
                date: new Date('2026-05-10T14:00:00Z'), time: '14:00', maxCapacity: 200, status: 'pending',
                venueId: venues[1].id, categoryId: cats[0].id, organizerId: 3,
                bannerImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
            },
            {
                title: 'Institutional Sustainability Drive',
                description: 'Grand initiative for carbon neutrality across campus grounds.',
                date: new Date('2026-05-22T08:00:00Z'), time: '08:00', maxCapacity: 500, status: 'pending',
                venueId: venues[2].id, categoryId: cats[2].id, organizerId: 3,
                bannerImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80'
            },
            {
                title: 'Advanced Photography Workshop',
                description: 'Visual storytelling and institutional heritage documentation techniques.',
                date: new Date('2026-06-05T16:00:00Z'), time: '16:00', maxCapacity: 30, status: 'pending',
                venueId: venues[3].id, categoryId: cats[3].id, organizerId: 3,
                bannerImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80'
            }
        ];

        for (const e of sampleEvents) {
            await prisma.event.create({ data: e });
        }
        console.log('Sample events generated.');
    } else {
        console.log('Events already exist, skipping event generation.');
    }

    console.log('--- Seeding Complete ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
