import { Prisma, User } from "@prisma/client";
import { prisma } from "src/common/prismaClient";

interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAllUsers(): Promise<Pick<User, "username" | "email" | "created_at" | "role">[]>;
}

export class PrismaUserRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data,
        })

        return user;
    }

    async findByUsername(username: string) {
        const user = await prisma.user.findUnique({
            where: {
                username,
            }
        })

        return user;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        return user;
    }

    async findAllUsers() {
        const users = await prisma.user.findMany({
            select: {
                username: true,
                email: true,
                created_at: true,
                role: true
            }
        })

        return users;
    }
}