import { GameData } from '../../../../model/GameData';
import { TokenData } from '../../../../model/TokenData';
import { IllegalGoldenTokenAcquirement } from './Exceptions/IllegalGoldenTokenAcquirement';
import { IllegalTokenCountAcquirement } from './Exceptions/IllegalTokenCountAcquirement';

export class TokenService {
	static VerifyTokenCredit(tokenCredit: TokenData, gameContext: GameData) {
		let totalCount = 0
		let colours = 0
		let singleColourCount = 0

		if (tokenCredit.Red > 0) {
			totalCount += tokenCredit.Red
			colours++
			singleColourCount = gameContext.Red
		}

		if (tokenCredit.Green > 0) {
			totalCount += tokenCredit.Green
			colours++
			singleColourCount = gameContext.Green
		}

		if (tokenCredit.Blue > 0) {
			totalCount += tokenCredit.Blue
			colours++
			singleColourCount = gameContext.Blue
		}

		if (tokenCredit.Black > 0) {
			totalCount += tokenCredit.Black
			colours++
			singleColourCount = gameContext.Black
		}

		if (tokenCredit.White > 0) {
			totalCount += tokenCredit.White
			colours++
			singleColourCount = gameContext.White
		}

		// verify

		if (tokenCredit.Golden > 0) {
			throw new IllegalGoldenTokenAcquirement()
		}

		if (totalCount > 3) {
			throw new IllegalTokenCountAcquirement()
		}

		if (totalCount === 2 && colours === 1 && singleColourCount < 4) {
			throw new IllegalTokenCountAcquirement()
		}

	}
}
