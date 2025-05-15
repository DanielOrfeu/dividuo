import auth from '@react-native-firebase/auth'

export default class UserService {
	static async Login(email: string, pass: string) {
		return auth()
			.signInWithEmailAndPassword(email, pass)
	}

	static async SignUp(email: string, pass: string, confirmpass: string) {
		if (pass === confirmpass) {
			return auth()
				.createUserWithEmailAndPassword(email, pass)
		} else {
			throw {
				code: 'auth/passwords-not-match'
			}
		}
	}

	static async ForgotPassword(email: string) {
		return auth()
			.sendPasswordResetEmail(email)
	}

	static async Logout() {
		return auth()
			.signOut()
	}

	static async EditUser(displayName: string) {
		return auth()
			.currentUser
			.updateProfile({
				displayName,
			})
	}

	static async EditUserEmail(email: string) {
		return auth()
			.currentUser
			.updateEmail(email)
	}

	static async VerifyEmail() {
		return auth()
			.currentUser
			.sendEmailVerification()
	}

	static async DeleteUser() {
		return auth()
			.currentUser
			.delete()
	}

	static async ChangePassword(password: string) {
		return auth()
			.currentUser
			.updatePassword(password)
	}

	static async ReauthenticateUser(password: string) {
		const user = auth().currentUser
		const credential = auth.EmailAuthProvider.credential(user.email, password)
		return user.reauthenticateWithCredential(credential)
	}
}



