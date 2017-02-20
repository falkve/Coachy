import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {PlayerSwitch, Util} from "../../assets/scripts/util";
import {StorageService} from "../../providers/storage-service";

/*
  Generated class for the SwitchPlayerSuggestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-switch-player-suggestion',
  templateUrl: 'switch-player-suggestion.html'
})
export class SwitchPlayerSuggestionPage {

  switchPlayers : Array<PlayerSwitch> = new Array<PlayerSwitch>();
  currentGame;
  constructor(public navCtrl: NavController, params: NavParams,  public viewCtrl: ViewController, public storageService: StorageService) {
    this.switchPlayers = params.get('switchPlayers');
    this.currentGame = storageService.getCurrentGame();
  }

  ionViewDidLoad() {
    console.log('Hello SwitchPlayerSuggestionPage Page');
  }

  close(){
    this.viewCtrl.dismiss();
  }

  doSwitchPlayers(){

    for(let playersKey in this.switchPlayers){
      let playerA = this.switchPlayers[playersKey].toBench;
      let playerB = this.switchPlayers[playersKey].toField;
      Util.changePlayer(this.storageService, this.currentGame, playerA, playerB);
    }

    this.close();

  }

}
