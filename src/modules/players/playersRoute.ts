// Import only what we need from express
import { Router } from 'express';
import { Middleware } from '../../middleware';
import { Validator } from '../../validate';
import { PlayersController } from './playersController';
import { PlayersMiddleware } from './playersMiddleware';


// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const playersController = new PlayersController();
const middleware = new Middleware();
const playersMiddleware = new PlayersMiddleware();

router.get('/',  playersController.getPlayers);
router.get('/:id',  playersController.getPlayer);
router.post('/:id',  playersController.updatePlayer);
router.post('/',  playersController.addPlayers);

// Export the express.Router() instance to be used by server.ts
export const PlayersRoute: Router = router;
