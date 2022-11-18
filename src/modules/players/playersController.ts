import { Constants } from "../../config/constants";
import { CDKServer } from "../../helpers/cdkServer";
import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Jwt } from "../../helpers/jwt";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { SendEmail } from "../../helpers/sendEmail";
import { PlayershUtils } from "./playersUtils";
import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Utils } from "../../helpers/utils";

export class PlayersController {
  private playersUtils: PlayershUtils = new PlayershUtils();

  public getPlayers = async (req: any, res: Response) => {
    const players = await this.playersUtils.getPlayers();
    res.status(players.code).json(players.result);
  };

  public getPlayer = async (req: any, res: Response) => {
    const players = await this.playersUtils.getPlayer(req.params.id);
    res.status(players.code).json(players.result);
  };
  public updatePlayer = async (req: any, res: Response) => {
    const playerData = req.body;
    const players = await this.playersUtils.updatePlayer(
      req.params.id,
      playerData
    );
    res.status(players.code).json(players.result);
  };

  public addPlayers = async (req: any, res: Response) => {
    const players = req.body.data;
    let playerAdded = 0;
    if (players.length > 0) {
      this.playersUtils.deleteAllPlayer();
    }
    players.map(async (player) => {
      const tmpPlayer = await this.playersUtils.addPlayer(player);
      playerAdded += tmpPlayer.affectedRows;
      console.log(tmpPlayer);
    });
    if (players.length == playerAdded) {
      res.status(Constants.SUCCESS_CODE).json({ noOfPlayers: playerAdded });
    }
    res.status(309).json({ noOfPlayers: playerAdded });
  };

  public getOwnPlayers = async (req: any, res: Response) => {
    const players = await this.playersUtils.getOwnPlayers(req.params.id);
    res.status(players.code).json(players.result);
  };
}
