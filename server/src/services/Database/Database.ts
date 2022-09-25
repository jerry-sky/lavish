import { PrismaClient } from '@prisma/client'
import { ID } from '../../../../model/ID'
import { PlayerNotFound } from './Exceptions/PlayerNotFound'

/**
 * Database interface.
 */
export const Database = new PrismaClient()

export class DatabaseService {
	public User = Database.user
	public Game = Database.game
	public GameCard = Database.gameCard
	public Card = Database.card
	public Player = Database.player

	static async getPlayer(playerID: ID) {
		const player = await Database.player.findFirst({ where: { ID: playerID } })
		if (!player) {
			throw new PlayerNotFound()
		}
		return player
	}
}
