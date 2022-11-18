// Import only what we need from express
import { Router } from 'express';
import { Middleware } from '../../middleware';
import { Validator } from '../../validate';
import { AuthController } from './authController';
import { PlayersMiddleware } from './authMiddleware';


// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const authController = new AuthController();
const middleware = new Middleware();
const playersMiddleware = new PlayersMiddleware();

router.post('/sign-in',  authController.signIn);

// Export the express.Router() instance to be used by server.ts
export const AuthRoute: Router = router;
