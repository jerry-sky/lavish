import { User } from '../../model/User'

declare module 'fastify' {
	/**
	 * Avails retaining information between multiple server requests,
	 * so the user does not need to authenticate for every request.
	 */
	interface Session {
		/**
		 * Logged in user’s data.
		 * Should be populated after successful authorization.
		 * Is equal to `null` when user is not logged in.
		 */
		user: User | null
	}
}
