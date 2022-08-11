import { AuthenticationData } from '../AuthenticationData'
import { UserData } from '../UserData'

export interface RegisterNewUserRequest extends UserData, AuthenticationData {
}
