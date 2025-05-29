import { FastifyInstance } from "fastify";
import { UserController } from "./userController";
import { UserService } from "./userService";
import { PrismaUserRepository } from "./userRepository";
import { VerifyJWT } from "src/middlewares/verify-jwt";
import { VerifyAdmin } from "src/middlewares/verify-admin";
import { VerifyCurrentUser } from "src/middlewares/verify-current-user";

async function userRoutes(app: FastifyInstance) {
    const prismaUserRepository = new PrismaUserRepository()
    const userService = new UserService(prismaUserRepository);
    const userController = new UserController(userService);

    app.post('/users', userController.store.bind(userController));
    app.post('/login', userController.login.bind(userController));
    app.get('/users', { preHandler: [VerifyJWT, VerifyAdmin] }, userController.index.bind(userController));
    app.get('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.show.bind(userController));
    app.patch('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.update.bind(userController));
    app.delete('/users/:id', { preHandler: [VerifyJWT, VerifyCurrentUser] }, userController.delete.bind(userController));

}

export default userRoutes;