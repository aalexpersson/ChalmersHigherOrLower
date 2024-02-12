import { PlayerService } from "./player";
import { singlePlayer } from "../model/singlePlayer";
import { SessionService } from "./game";
import { CourseService } from "./course";
import { Player } from "../model/player";

export class singlePlayerService{

    sessionService = new SessionService();
    playerService = PlayerService.getInstance();

    async createSinglePlayerGame(playerId : number) : Promise<singlePlayer | undefined>{

        let player = await this.playerService.getPlayer(playerId);
        let session = await this.sessionService.createSession()

        if(!player||!session)
            return undefined;

        let newSingleSession = {
            player : player,
            session : session
        }
        return {...newSingleSession}
    }
}