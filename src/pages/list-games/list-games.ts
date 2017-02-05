import { Component } from '@angular/core';
import { ModalController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {Team} from "../../assets/scripts/gametypes";
import {AddGamePage} from "../add-game/add-game";
import {TabsPage} from "../tabs/tabs";
import {Util} from "../../assets/scripts/util";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-games',
  templateUrl: 'list-games.html'
})
export class ListGamesPage {

  games;
  team : Team;
  timeIntervalId = null;
  date : Date = new Date();

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storageService : StorageService) {
    this.games = storageService.getActiveGames();
    this.team = storageService.getCurrentTeam();
  }

  addGame(){
    let profileModal = this.modalCtrl.create(AddGamePage);

    profileModal.onDidDismiss(data => {
      if(data){
        this.navCtrl.push(TabsPage);
      }
    });

    profileModal.present();
  }

  deleteGame(game){
    this.games.remove(game);
  }


  goToGame(game){
    this.storageService.setCurrentGame(game);
    this.navCtrl.pop();
    this.navCtrl.push(TabsPage);
  }

  calcTime(game){
    if(game.period != null){
      return ', Period:' + game.period.period +' (' + Util.getElapsedTime(game.startTime,this.date.getTime()).getTime() + ')';
    } else if(game.historyPeriods != null){
      return ', Period(s) played:' + game.historyPeriods.length + ', PAUS';
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


