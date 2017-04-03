import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from "firebase/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

/*
  Generated class for the AuthenticationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthenticationService {

  provider : GoogleAuthProvider = null;

  constructor(public http: Http) {
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/plus.login');
    this.provider.setCustomParameters({
      'login_hint': 'falk.anders@gmail.com'
    });

  }

  isAuthenticated(){
    var user = firebase.auth().currentUser;

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  signIn(){
    firebase.auth().signInWithRedirect(this.provider);
  }

}
