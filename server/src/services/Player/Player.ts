import { PlayerData } from '../../../../model/PlayerData';

export class PlayerService {
	static CalculatePlayerTokens(data: PlayerData) {
		return data.Red + data.Green + data.Blue + data.Black + data.White + data.Golden
	}
}
