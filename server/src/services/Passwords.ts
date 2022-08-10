import SecurePassword from 'secure-password'

const pwd = new SecurePassword()

/**
 * Helper service for creating password hashes and verifying them.
 */
export class Passwords {
	/**
	 * Create a new hash from a string password.
	 */
	static async HashPassword(password: string): Promise<string> {
		const p = Buffer.from(password)
		const hash = await pwd.hash(p)
		return hash.toString('base64')
	}

	/**
	 * Verify whether a provided password is valid against a password hash from the database.
	 */
	static async VerifyPassword(givenPassword: string, savedHash: string): Promise<boolean> {
		const g = Buffer.from(givenPassword)
		const s = Buffer.from(savedHash, 'base64')
		const res = await pwd.verify(g, s)

		switch (res) {
			case SecurePassword.INVALID:
			case SecurePassword.INVALID_UNRECOGNIZED_HASH:
			default:
				return false
			case SecurePassword.VALID_NEEDS_REHASH:
				throw new Error('VALID_NEEDS_REHASH')
			case SecurePassword.VALID:
				return true
		}
	}
}
