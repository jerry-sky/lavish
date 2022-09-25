import { CardData } from '../../../../model/CardData'
import { GameData } from '../../../../model/GameData'
import { PlayerData } from '../../../../model/PlayerData'
import { TokenData } from '../../../../model/TokenData'
import { CardElectedToBeAcquiredNotAffordable } from './Exceptions/AbstractInvalidCardElectedToBeAcquired'
import { IllegalGoldenTokenAcquirement } from './Exceptions/IllegalGoldenTokenAcquirement'
import { IllegalTokenCountAcquirement } from './Exceptions/IllegalTokenCountAcquirement'

type TokenDataCalc = Omit<TokenData, 'Golden'> & { Golden?: number }

export class TokenService {
	/**
	 * Verify the proposed quantity and type of tokens are valid.
	 */
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

	static CalculateCardPrice(cardToBuy: CardData, playerData: PlayerData, ownedCards: CardData[]): TokenData {
		const potentialDiscount = this.cardsValue(ownedCards)

		const potentialPrice = this.subtractTokens(cardToBuy, potentialDiscount, true)

		return this.VerifyTokenDebit(potentialPrice, playerData)
	}

	/**
	 * Subtracts tokens of two given objects.
	 */
	static subtractTokens(one: TokenDataCalc, two: TokenDataCalc, clamp = false): TokenData {
		if (clamp) {
			return {
				Red: Math.max(one.Red - two.Red, 0),
				Green: Math.max(one.Green - two.Green, 0),
				Blue: Math.max(one.Blue - two.Blue, 0),
				Black: Math.max(one.Black - two.Black, 0),
				White: Math.max(one.White - two.White, 0),
				Golden: Math.max((one.Golden ?? 0) - (two.Golden ?? 0), 0),
			}
		}
		return {
			Red: one.Red - two.Red,
			Green: one.Green - two.Green,
			Blue: one.Blue - two.Blue,
			Black: one.Black - two.Black,
			White: one.White - two.White,
			Golden: (one.Golden ?? 0) - (two.Golden ?? 0),
		}
	}

	/**
	 * Adds tokens of two given objects.
	 */
	static addTokens(one: TokenDataCalc, two: TokenDataCalc): TokenData {
		return {
			Red: one.Red + two.Red,
			Green: one.Green + two.Green,
			Blue: one.Blue + two.Blue,
			Black: one.Black + two.Black,
			White: one.White + two.White,
			Golden: (one.Golden ?? 0) + (two.Golden ?? 0),
		}
	}

	static cardsValue(cards: CardData[]): TokenData {
		const value: TokenData = {
			Red: 0,
			Blue: 0,
			Green: 0,
			Black: 0,
			White: 0,
			Golden: 0,
		}

		for (const card of cards) {
			switch (card.Colour) {
				case 'Red':
					value.Red++
					break
				case 'Green':
					value.Green++
					break
				case 'Blue':
					value.Blue++
					break
				case 'Black':
					value.Black++
					break
				case 'White':
					value.White++
					break
			}
		}

		return value
	}

	private static VerifyTokenDebit(tokenDebit: TokenData, playerData: PlayerData): TokenData {
		const diff = this.subtractTokens(playerData, tokenDebit)

		const debitLeftToPay = this.sumNegative(diff)
		// apply golden tokens
		if (debitLeftToPay > playerData.Golden) {
			throw new CardElectedToBeAcquiredNotAffordable()
		}

		const cost = this.subtractTokens(playerData, tokenDebit, true)
		cost.Golden = playerData.Golden - debitLeftToPay
		return cost
	}

	private static sumNegative(tokenData: TokenDataCalc): number {
		let totalNegative = 0
		if (tokenData.Red < 0) {
			totalNegative += Math.abs(tokenData.Red)
		}
		if (tokenData.Blue < 0) {
			totalNegative += Math.abs(tokenData.Blue)
		}
		if (tokenData.Green < 0) {
			totalNegative += Math.abs(tokenData.Green)
		}
		if (tokenData.Black < 0) {
			totalNegative += Math.abs(tokenData.Black)
		}
		if (tokenData.White < 0) {
			totalNegative += Math.abs(tokenData.White)
		}
		if (tokenData.Golden ?? 0 < 0) {
			totalNegative += Math.abs(tokenData.Golden ?? 0)
		}
		return totalNegative
	}

}
