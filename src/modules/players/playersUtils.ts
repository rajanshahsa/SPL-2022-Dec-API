import * as mysql from 'jm-ez-mysql';
import { Tables, PlayersTable, TEAMPLAYERSTable } from '../../config/tables';
import { Log } from '../../helpers/logger';
import { ResponseBuilder } from '../../helpers/responseBuilder';

export class PlayershUtils {
  // Create User
  private logger = Log.getLogger();


  // Get Players  
  public async getPlayers() {
    const players = await mysql.findAll(Tables.PLAYERS, [
      PlayersTable.ID,
      PlayersTable.NAME,
      PlayersTable.BASEPRICE,
      PlayersTable.CURRENTPRICE,
      PlayersTable.BATTINGSTYLE,
      PlayersTable.BOWLINGSTYLE,
      PlayersTable.ISSOLD,
      PlayersTable.WANTTOBECAPTAIN,
      PlayersTable.SKILLS,
      PlayersTable.BATTINGRATING,
      PlayersTable.BOWLINGRATING,
      PlayersTable.SOLDTO,
    ],
    ` ${PlayersTable.SPORTS} like "%Cricket%"`,);
   return ResponseBuilder.data({ data: players });
  }

  // Get Player
  public async getPlayer(id) {
    const player = await mysql.first(Tables.PLAYERS, [
      PlayersTable.ID,
      PlayersTable.NAME,
      PlayersTable.BASEPRICE,
      PlayersTable.CURRENTPRICE,
      PlayersTable.BATTINGSTYLE,
      PlayersTable.BOWLINGSTYLE,
      PlayersTable.ISSOLD,
      PlayersTable.WANTTOBECAPTAIN,
      PlayersTable.SKILLS,
      PlayersTable.BATTINGRATING,
      PlayersTable.BOWLINGRATING,
      PlayersTable.SOLDTO,
    ],
    `${PlayersTable.ID} = ? and ${PlayersTable.SPORTS} like "%Cricket%"`, [id]);
   return ResponseBuilder.data({ data: player });
  }

  // Get Player
  public async updatePlayer(id,playerData) {
    const updateData = await mysql.updateFirst(
      Tables.PLAYERS,
      playerData,
      `${PlayersTable.ID}=${id}`
    );
    return ResponseBuilder.data({ id: updateData.affectedRows });
  }

  public addPlayer = async (item) => {
    return await mysql.insert(Tables.PLAYERS, item);
  };

  public deleteAllPlayer = async () => {
     await mysql.delete(Tables.PLAYERS);
     return await mysql.query("ALTER TABLE `SPL-Dec`.players AUTO_INCREMENT=1");
     
  };

   // Get Players 
   public async getOwnPlayers(id) {
    const players = await mysql.findAll(`${Tables.TEAMPLAYERS} t LEFT JOIN ${Tables.PLAYERS} p 
    on t.${TEAMPLAYERSTable.PLAYERID} = p.${PlayersTable.ID}`, [
      `p.${PlayersTable.ID}`,
      `p.${PlayersTable.NAME}`,
      `p.${PlayersTable.BASEPRICE}`,
      `p.${PlayersTable.CURRENTPRICE}`,
      `p.${PlayersTable.BATTINGSTYLE}`,
      `p.${PlayersTable.BOWLINGSTYLE}`,
      `p.${PlayersTable.ISSOLD}`,
      `p.${PlayersTable.WANTTOBECAPTAIN}`,
      `p.${PlayersTable.SKILLS}`,
      `p.${PlayersTable.BATTINGRATING}`,
      `p.${PlayersTable.BOWLINGRATING}`,
      `p.${PlayersTable.SOLDTO}`,
    ],
    `t.${TEAMPLAYERSTable.TEAMID} = ?`, [+id]);
   return ResponseBuilder.data({ data: players });
  }
}
