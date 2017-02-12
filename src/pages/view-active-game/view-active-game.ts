import { Component } from '@angular/core';
import {ModalController, NavParams, AlertController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {Team, Game} from "../../assets/scripts/gametypes";
import {ChangeGamePositionPage} from "../change-game-position/change-game-position";
import {Util} from "../../assets/scripts/util";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-activegame',
  templateUrl: 'view-active-game.html'
})
export class ViewActiveGamePage {

  gamePlayers;
  team : Team;
  game : Game;
  date : Date = new Date();
  timeIntervalId = null;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public params:NavParams, public storageService : StorageService, public alertCtrl: AlertController) {
    this.game = storageService.getCurrentGame();
    this.team = storageService.getCurrentTeam();
    this.gamePlayers = storageService.getCurrentGamePlayers();
    //this.sortPlayers();
  }

/*  sortPlayers(){
    this.gamePlayers = this.game.players.sort((gamePlayer1,gamePlayer2)=>{


      if (gamePlayer1.position.startTime > gamePlayer2.position.startTime) {
        return 1;
      }

      if (gamePlayer1.position.startTime < gamePlayer2.position.startTime) {
        return -1;
      }

      return 0;
    });
  }*/

  changePosition(gamePlayer){
    if(gamePlayer.position.id == 'GoalK'){
        this.showConfirm(gamePlayer);
    } else {
      this.showChangePosition(gamePlayer);
    }
  }

  showChangePosition(gamePlayer){
    let profileModal = this.modalCtrl.create(ChangeGamePositionPage, { player: gamePlayer });

    profileModal.onDidDismiss(data => {
      //this.sortPlayers();
    });

    profileModal.present();
  }

  showConfirm(gamePlayer) {
    let confirm = this.alertCtrl.create({
      title: 'Change goalkeeper?',
      message: 'Are you sure you want to change the goalkeeper?',
      buttons: [
        {
          text: 'No',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.showChangePosition(gamePlayer);
          }
        }
      ]
    });
    confirm.present();
  }

  calcTime(dateTime){
    if(dateTime != 0){
      return '- (' + Util.getElapsedTime(dateTime,this.date.getTime()).getTime() + ')';
    } else {
      return '';
    }
  }

  ionViewWillEnter() {
    this.timeIntervalId = setInterval(()=>{
      this.date = new Date();
    },1000);
  }

  ionViewWillLeave(){
    clearInterval(this.timeIntervalId);
    this.timeIntervalId = null;
  }
}


