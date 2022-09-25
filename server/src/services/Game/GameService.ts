import { GameCard, GameCardStatus, Player } from '@prisma/client'
import { ID } from '../../../../model/ID'
import { TokenData } from '../../../../model/TokenData'
import { Database } from '../Database/Database'
import { CardElectedToBeAcquiredDoesNotExist } from './Exceptions/AbstractInvalidCardElectedToBeAcquired'
import { InvalidPlayerListForNewGame } from './Exceptions/InvalidPlayerListForNewGame'
import { NoCardsLeftToRevealInGame } from './Exceptions/NoCardsLeftToRevealInGame'
import { TokenService } from './Token'

export class GameService {
	static async Create(users: ID[]) {
		if (!users || users.length < 2 || users.length > 4) {
			throw new InvalidPlayerListForNewGame()
		}

		// get all available cards
		const cards = await Database.card.findMany()

		let regularTokenCount = 4
		if (users.length === 3) {
			regularTokenCount = 5
		} else if (users.length === 4) {
			regularTokenCount = 7
		}

		const game = await Database.game.create({
			data: {
				Black: regularTokenCount,
				Blue: regularTokenCount,
				Golden: 5,
				Green: regularTokenCount,
				Red: regularTokenCount,
				White: regularTokenCount,
				Players: {
					createMany: {
						data: users.map(
							(userID) =>
								<Player>{
									Black: 0,
									Blue: 0,
									Golden: 0,
									Green: 0,
									Red: 0,
									White: 0,
									userID,
								},
						),
					},
				},
				// populate the Game with all available cards
				GameCard: {
					createMany: {
						data: cards.map(
							(card) =>
								<GameCard>{
									Status: GameCardStatus.Hidden,
									cardID: card.ID,
									playerID: null,
								},
						),
					},
				},
			},
		})

		return game
	}

	static async RevealCard(gameID: ID) {
		const gameCardsCount = await Database.gameCard.count({
			where: {
				gameID: gameID,
				Status: GameCardStatus.Hidden,
			},
		})

		if (gameCardsCount === 0) {
			throw new NoCardsLeftToRevealInGame()
		}

		const randomNumber = Math.floor(Math.random() * (gameCardsCount - 1))

		const gameCard = await Database.gameCard.findFirst({
			skip: randomNumber,
			where: {
				gameID: gameID,
				Status: GameCardStatus.Hidden,
			},
		})

		if (!gameCard) {
			throw new NoCardsLeftToRevealInGame()
		}

		await Database.gameCard.update({
			where: {
				ID: gameCard.ID,
			},
			data: {
				Status: GameCardStatus.Drawn,
			},
		})

		return gameCard
	}

	static async CreditTokens(playerID: ID, tokenCredit: TokenData): Promise<void> {
		const player = await Database.player.findFirstOrThrow({
			where: { ID: playerID },
			include: {
				Game: true,
			},
		})
		const game = player.Game

		TokenService.VerifyTokenCredit(tokenCredit, game)

		// subtract tokens from game
		// add tokens to player’s account
		await Database.game.update({
			where: {
				ID: game.ID,
			},
			data: {
				...TokenService.subtractTokens(game, tokenCredit),
				Players: {
					update: {
						where: {
							ID: playerID,
						},
						data: {
							...TokenService.addTokens(player, tokenCredit),
						},
					},
				},
			},
		})
	}

	static async AcquireCard(playerID: ID, gameCardID: ID) {
		const player = await Database.player.findFirstOrThrow({
			where: { ID: playerID },
			include: {
				GameCard: {
					include: {
						Card: true,
					},
				},
				Game: {
					include: {
						GameCard: {
							include: {
								Card: true,
							},
							where: {
								ID: {
									equals: gameCardID,
								},
							},
						},
					},
				},
			},
		})
		const gameCardToBuy = player.Game.GameCard[0]
		const playerAcquiredCards = player.GameCard.map((gameCard) => gameCard.Card)

		if (!gameCardToBuy) {
			throw new CardElectedToBeAcquiredDoesNotExist()
		}

		const cardPrice = TokenService.CalculateCardPrice(
			gameCardToBuy.Card,
			player,
			playerAcquiredCards,
		)

		await Database.player.update({
			where: { ID: playerID },
			data: {
				...TokenService.subtractTokens(player, cardPrice),
				Game: {
					update: {
						GameCard: {
							update: {
								where: {
									ID: gameCardToBuy.ID,
								},
								data: {
									playerID,
									Status: GameCardStatus.Acquired,
								},
							},
						},
					},
				},
			},
		})
	}
}
