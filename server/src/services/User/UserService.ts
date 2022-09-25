import { Credentials } from '../../../../model/Credentials'
import { RegisterNewUserRequest } from '../../../../model/ServerRequests/RegisterNewUser'
import { UserData } from '../../../../model/UserData'
import { Database } from '../Database/Database'
import { UserAlreadyExistsException } from './Exceptions/UserAlreadyExists'
import { UserNotFoundException } from './Exceptions/UserNotFound'
import { UserPasswordInvalidException } from './Exceptions/UserPasswordInvalid'
import { Passwords } from './Passwords'

export class UserService {
	/**
	 * Find user by their login and verify given password is valid.
	 */
	static async Authenticate(credentials: Credentials) {
		const foundUser = await Database.user.findFirst({
			where: {
				OR: {
					Username: {
						equals: credentials.Login,
					},
					Email: {
						equals: credentials.Login,
					},
				},
			},
		})

		if (!foundUser) {
			throw new UserNotFoundException()
		}

		if (!(await Passwords.VerifyPassword(credentials.Password, foundUser.Password))) {
			throw new UserPasswordInvalidException()
		}

		return <UserData>{
			Username: foundUser.Username,
			Email: foundUser.Email,
		}
	}

	static async RegisterNew(data: RegisterNewUserRequest) {
		const potentialDuplicateUser = await Database.user.findFirst({
			where: {
				OR: {
					Username: {
						equals: data.Username,
					},
					Email: {
						equals: data.Email,
					},
				},
			},
		})

		if (potentialDuplicateUser) {
			throw new UserAlreadyExistsException()
		}

		const createdUser = await Database.user.create({
			data: {
				Email: data.Email,
				Password: await Passwords.HashPassword(data.Password),
				Username: data.Username,
			},
		})

		return <UserData>{
			Email: createdUser.Email,
			Username: createdUser.Username,
		}
	}
}
