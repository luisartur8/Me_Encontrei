import { FastifyInstance } from "fastify";
import { UserController } from "./userController";
import { UserService } from "./userService";
import { PrismaUserRepository } from "./userRepository";
import { VerifyJWT } from "src/middlewares/verify-jwt";
import { VerifyAdmin } from "src/middlewares/verify-admin";

async function userRoutes(app: FastifyInstance) {
    const prismaUserRepository = new PrismaUserRepository()
    const userService = new UserService(prismaUserRepository);
    const userController = new UserController(userService);

    app.post('/users', userController.store.bind(userController));
    app.post('/login', userController.login.bind(userController));

    app.get('/users', { preHandler: [VerifyJWT, VerifyAdmin] }, userController.index.bind(userController));
    // app.get('/users/:id');

}

export default userRoutes;