import { Constants } from "../../config/constants";
import { CDKServer } from "../../helpers/cdkServer";
import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Jwt } from "../../helpers/jwt";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { SendEmail } from "../../helpers/sendEmail";
import { AuthUtils } from "./authUtils";
import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Utils } from "../../helpers/utils";

export class AuthController {
  private authUtils: AuthUtils = new AuthUtils();

  public signIn = async (req: any, res: Response) => {
    const data = req.body;
    const players = await this.authUtils.signIn(data.email,data.password);
    res.status(players.code).json(players.result);
  };

}
