import { CreateUserInput } from "./userSchema";
import { compare, hash } from "bcryptjs";
import { PrismaUserRepository } from "./userRepository";
import { User } from "@prisma/client";
import { AppError } from "src/common/AppError";
import { FastifyReply } from "fastify";

interface RegisterUseCaseResponse {
    user: User
}

export class UserService {
    constructor(private userRepository: PrismaUserRepository) { }

    async createUser({ username, email, password }: CreateUserInput): Promise<RegisterUseCaseResponse> {
        const usernameExists = await this.userRepository.findByUsername(username);
        const emailExists = await this.userRepository.findByEmail(email);

        if (usernameExists || emailExists) {
            const conflictFields: Record<string, string> = {};

            if (usernameExists) conflictFields.username = 'Username already exists';
            if (emailExists) conflictFields.email = 'Email already exists';

            throw new AppError('User already exists', 409, {
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

        return { user }
    }

    async login(username: string, password: string, reply: FastifyReply) {
        const user = await this.userRepository.findByUsername(username);

        if (!user || !(await compare(password, user.password_hash))) {
            throw new AppError('Invalid username or password', 401, {
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
}
