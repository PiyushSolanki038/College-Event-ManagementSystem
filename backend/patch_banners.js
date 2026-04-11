const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Map event titles to relevant Unsplash banner images
const bannerMap = {
    'Quantum Computing Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    'Annual Cultural Mosaic': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'Robotics Workshop 2.0': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    'Inter-disciplinary AI Seminar': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'Institutional Sustainability Drive': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    'Advanced Photography Workshop': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
};

async function main() {
    const events = await prisma.event.findMany();
    console.log(`Found ${events.length} events to patch...`);

    for (const event of events) {
        const banner = bannerMap[event.title];
        if (banner) {
            await prisma.event.update({
                where: { id: event.id },
                data: { bannerImage: banner }
            });
            console.log(`✓ Patched: ${event.title}`);
        } else {
            // Fallback: assign a generic event image
            await prisma.event.update({
                where: { id: event.id },
                data: { bannerImage: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80` }
            });
            console.log(`✓ Patched (fallback): ${event.title}`);
        }
    }

    console.log('All events now have banner images!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
