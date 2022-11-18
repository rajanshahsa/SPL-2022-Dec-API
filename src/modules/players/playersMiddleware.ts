import bcryptjs = require('bcryptjs');
import { Request, Response } from 'express';
import * as mysql from 'jm-ez-mysql';
import * as moment from 'moment';

import { Constants } from '../../config/constants';
import { Tables, UserTable } from '../../config/tables';
import { PlayershUtils } from './playersUtils';
import * as path from 'path';
import { SendEmail } from '../../helpers/sendEmail';

export class PlayersMiddleware {
  private authUtils: PlayershUtils = new PlayershUtils();

}
