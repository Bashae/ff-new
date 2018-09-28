import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

import { PostsPage } from '../posts/posts';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {
  username: string = "";
  password: string = "";
  isWrongPassword: boolean = false;
  isNotValid: boolean = false;
  tempUser: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public auth: AuthProvider,
    public alertCtrl: AlertController
  ) {

  }

  setCredentials() {
    if ( this.username === "" ) {
      this.showAlert("Please enter an email address.");
      return false;
    }

    if ( this.password === "" ) {
      this.showAlert("Please enter a password.");
      return false;
    }
    
    return {
      email: this.username,
      password: this.password
    };
  }

  attemptLogin() {
    let credentials = this.setCredentials();
    if ( !credentials ) { return false; }

    this.auth.signInWithEmail(credentials)
      .then(
        (res) => { 
          if(res.user.emailVerified) {
            this.navCtrl.push(PostsPage);
          } else {
            this.showAlert("Email has no yet been verified! Please verify your email.");
            this.tempUser = res;
            this.isNotValid = true;
            this.auth.logOut();
          }
        },
        (err) => { 
          if(err.code == "auth/wrong-password") {
            this.showAlert("Please enter the correct password.");
            this.isWrongPassword = true;
          }
          if(err.code == "auth/invalid-email") {
            this.showAlert("Please enter a valid email address");
          }
        }
      )
  }

  attemptRegistration() {
    let credentials = this.setCredentials();
    if ( !credentials ) {  return false; }

    this.auth.signUpWithEmail(credentials)
      .then(
        (res) => {
          if(res.user.emailVerified) {
            this.navCtrl.push(PostsPage);
          } else {
            this.showAlert("Please verify your email before continuing.");
            this.isNotValid = true;
          }
        },
        (err) => {
          if(err.code == "auth/email-already-in-use") {
            this.showAlert("This Email already exists.");
          }
          if(err.code == "auth/invalid-email") {
            this.showAlert("Please enter a proper email.");
          }
        }
      )
  }

  sendEmailValidation() {
    let emailValidation = this.auth.sendUserVerificationEmail(this.tempUser)
    emailValidation.then(res => {
      this.showAlert("Email Validation sent!");
      this.isNotValid = false;
      this.tempUser = null;
    })
  }

  sendPasswordReset() {
    this.auth.sendPasswordResetEmail(this.username).then(res => {
      this.showAlert("Reset Password Email sent!");
      this.isWrongPassword = false;
    })
  }

  showAlert(msg) {
    const alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  logOut() {
    this.auth.logOut();
  }

}
