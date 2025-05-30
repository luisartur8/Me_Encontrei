import { compare, hash } from "bcryptjs";
import { PrismaUserRepository } from "./userRepository";
import { User } from "@prisma/client";
import { AppError } from "src/common/AppError";
import { FastifyReply } from "fastify";
import { IUserService } from "./user.interfaces";

export class UserService implements IUserService {
    constructor(private readonly userRepository: PrismaUserRepository) { }

    async createUser(username: string, email: string, password: string) {
        const usernameExists = await this.userRepository.findByUsername(username);
        const emailExists = await this.userRepository.findByEmail(email);

        if (usernameExists || emailExists) {
            const conflictFields: Record<string, string> = {};

            if (usernameExists) conflictFields.username = 'Username already exists';
            if (emailExists) conflictFields.email = 'Email already exists';

            throw new AppError('User already exists', 409, {
                isOperational: true,
                code: 'USER_EXISTS',
                details: conflictFields,
            });
        }

        const password_hash = await hash(password, 6);

        const user = await this.userRepository.create({
            username,
            email,
            password_hash,
            created_at: new Date(),
            role: 'user'
        })

        const { password_hash: _, ...safeUser } = user;

        return safeUser;
    }

    async login(username: string, password: string, reply: FastifyReply) {
        const user = await this.userRepository.findByUsername(username);

        if (!user || !(await compare(password, user.password_hash))) {
            throw new AppError('Invalid username or password', 401, {
                isOperational: true,
                code: 'INVALID_USERNAME_OR_PASSWORD',
                details: 'Invalid username or password',
            });
        }

        return reply.jwtSign(
            {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: "1h",
                },
            }
        );
    }

    async findUserByUsername(username: string) {
        return this.userRepository.findByUsername(username);
    }

    async getUsers() {
        return this.userRepository.findAllUsers();
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        const { password_hash: _, ...safeUser } = user;

        return safeUser;
    }

    async updateUserById(id: string, data: Partial<User>, isAdmin: boolean) {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        let updatedData = data;

        if (!isAdmin) {
            const { id: _, created_at: __, role: ___, ...allowedFields } = data;
            updatedData = allowedFields;
        }

        const updatedUser = await this.userRepository.updateUserById(id, updatedData);

        const { password_hash: _, ...safeUpdatedUser } = updatedUser;

        return safeUpdatedUser;
    }

    async deleteUserById(id: string) {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        await this.userRepository.deleteUserById(id);
    }
}
