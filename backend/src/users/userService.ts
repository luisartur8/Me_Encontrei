import { compare, hash } from "bcryptjs";
import { PrismaUserRepository } from "./userRepository";
import { User } from "@prisma/client";
import { isStrongPassword, isValidEmail, isValidUsername } from "src/common/utils";
import { AppError } from "src/common/AppError";
import { FastifyReply } from "fastify";
import { IUserService, UpdateUserData, UpdateUserDataWithHash, UpdateUserRequest } from "./user.interfaces";

export class UserService implements IUserService {
    constructor(private readonly userRepository: PrismaUserRepository) { }

    async createUser(username: string, email: string, password: string) {
        const usernameExists = await this.userRepository.findByUsername(username);
        const emailExists = await this.userRepository.findByEmail(email);

        const conflictFields: Record<string, string> = {};

        if (usernameExists) conflictFields.username = 'Username already exists';
        if (emailExists) conflictFields.email = 'Email already exists';

        if (Object.keys(conflictFields).length > 0) {
            throw new AppError('User already exists', 409, {
                isOperational: true,
                code: 'USER_EXISTS',
                details: conflictFields,
            });
        }

        if (!isValidUsername(username)) conflictFields.username = 'Invalid username format';
        if (!isValidEmail(email)) conflictFields.email = 'Invalid email format';
        if (!isStrongPassword(password)) conflictFields.password = 'Password does not meet strength requirements';

        if (Object.keys(conflictFields).length > 0) {
            throw new AppError('Invalid user data', 400, {
                isOperational: true,
                code: 'INVALID_DATA',
                details: conflictFields,
            });
        }

        const password_hash = await hash(password, 6);

        const user = await this.userRepository.create({
            username,
            email,
            password_hash,
            created_at: new Date(),
            role: 'USER'
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

    async updateUserById(id: string, data: UpdateUserData, isAdmin: boolean) {
        const { username, email, password, ...rest } = data;

        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new AppError('User not found', 404, {
                isOperational: true,
                code: 'USER_NOT_FOUND',
                details: 'User was not found',
            });
        }

        let usernameExists = null
        let emailExists = null

        if (username) {
            const existingUsername = await this.userRepository.findByUsername(username);

            if (existingUsername && existingUsername.id !== user.id) {
                usernameExists = existingUsername;
            }
        }

        if (email) {
            const existingEmail = await this.userRepository.findByEmail(email);

            if (existingEmail && existingEmail.id !== user.id) {
                usernameExists = existingEmail;
            }
        }

        const conflictFields: Record<string, string> = {};

        if (usernameExists || emailExists) {
            if (usernameExists) conflictFields.username = 'Username already exists';
            if (emailExists) conflictFields.email = 'Email already exists';

            throw new AppError('User already exists', 409, {
                isOperational: true,
                code: 'USER_EXISTS',
                details: conflictFields,
            });
        }

        // TODO: É possivel adicionar mais validações, já que um administrador pode mudar tudo.
        if (username && !isValidUsername(username)) conflictFields.username = 'Invalid username format';
        if (email && !isValidEmail(email)) conflictFields.email = 'Invalid email format';
        if (password && !isStrongPassword(password)) conflictFields.password = 'Password does not meet strength requirements';

        if (Object.keys(conflictFields).length > 0) {
            throw new AppError('Invalid user data', 400, {
                isOperational: true,
                code: 'INVALID_DATA',
                details: conflictFields,
            });
        }

        let updatedData: UpdateUserDataWithHash = { ...rest };

        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (password) updatedData.password_hash = await hash(password, 6);

        if (!isAdmin) {
            const { created_at: _, role: __, ...allowedFields } = updatedData;
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
