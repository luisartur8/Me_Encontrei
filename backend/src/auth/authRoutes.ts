import { FastifyInstance } from "fastify";
import { AuthController } from "./authController";
import { AuthService } from "./authService";
import { PrismaUserRepository } from "src/users/userRepository";

async function authRoutes(app: FastifyInstance) {
  const prismaUserRepository = new PrismaUserRepository()
  const authService = new AuthService(prismaUserRepository);
  const authController = new AuthController(authService);

  app.post('/auth/register', authController.register.bind(authController));
  app.post('/auth/login', authController.login.bind(authController));

}

export default authRoutes;