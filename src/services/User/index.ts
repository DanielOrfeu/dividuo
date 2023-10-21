import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native'

export default class UserService {
    static async Login(email, pass) {
        return auth()
        .signInWithEmailAndPassword(email, pass)
    }

    static async SignUp(email, pass, confirmpass) {
        if(pass === confirmpass) {
            return auth()
            .createUserWithEmailAndPassword(email, pass)
        } else {
            throw {
                code: 'auth/passwords-not-match'
            }
        }
    }

    static async ForgotPassword(email){
        return auth()
        .sendPasswordResetEmail(email)
    }

    static async Logout(){
        return auth()
        .signOut()
    }

    static async EditUser(name){
        return auth()
        .currentUser
        .updateProfile({
            displayName: name,
        })
    }

    static async EditUserEmail(email){
        return auth()
        .currentUser
        .updateEmail(email)
    }

    static async VerifyEmail(){
        return auth()
        .currentUser
        .sendEmailVerification()
    }

    static async DeleteUser(){
        return auth()
        .currentUser
        .delete()
    }

    static async ReauthenticateUser(password: string){
        let user = auth().currentUser
        let credential = auth.EmailAuthProvider.credential(user.email, password)
        return user.reauthenticateWithCredential(credential)
    }
}



