import * as express from 'express';
import { Constants } from './config/constants';
import { PlayersRoute } from './modules/players/playersRoute';
import { AuthRoute } from './modules/auth/authRoute';


export class Routes {
  protected basePath: string;

  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case 'production':
        this.basePath = '/app/dist';
        break;
      case 'development':
        this.basePath = '/app/public';
        break;
    }
  }

  public defaultRoute(req: express.Request, res: express.Response) {
    res.json({
      message: 'Hello !',
    });
  }

  public path() {
    const router = express.Router();

    router.use('/auth', AuthRoute);
    router.use('/players', PlayersRoute);

    router.all('/*', (req: any, res: any) => {
      return res.status(Constants.NOT_FOUND_CODE).json({
        error: req.t('ERR_URL_NOT_FOUND'),
      });
    });
    return router;
  }
}
