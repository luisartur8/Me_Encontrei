import { Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import { prisma } from 'src/common/prismaClient';

async function createUserIfNotExists(username: string, email: string, role: Role, password = '123456') {
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
        console.log(`❌ User "${username}" already exists.`);
        return;
    }

    const password_hash = await hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password_hash,
            created_at: new Date(),
            role,
        },
    });

    console.log(`✅ User "${username}" created:`, user);
}

async function main() {
    await createUserIfNotExists('admin', 'admin@meecontrei.com', Role.ADMIN, '123456');
    await createUserIfNotExists('default_user', 'default_user@meecontrei.com', Role.USER, '123456');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })