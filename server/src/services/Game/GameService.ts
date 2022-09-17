import { GameCard, GameCardStatus, Player } from '@prisma/client'
import { ID } from '../../../../model/ID'
import { TokenData } from '../../../../model/TokenData'
import { Database } from '../Database/Database'
import { GameNotFound } from '../Database/Exceptions/GameNotFound'
import { InvalidPlayerListForNewGame } from './Exceptions/InvalidPlayerListForNewGame'
import { NoCardsLeftToRevealInGame } from './Exceptions/NoCardsLeftToRevealInGame'
import { PlayerNotFound } from '../Database/Exceptions/PlayerNotFound'
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

	static async CreditTokens(playerID: ID, tokenCredit: TokenData) {
		const player = await Database.player.findFirst({ where: { ID: playerID }})
		const game = await Database.game.findFirstOrThrow({ where: { Players: { every: { ID: playerID } } } })

		TokenService.VerifyTokenCredit(tokenCredit, game)
	}

	static async AcquireCard(playerID: ID, gameCardID: ID) {
		const player = await Database.player.findFirst({ where: { ID: playerID }})
	}
}
