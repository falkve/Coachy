import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Team} from "../../assets/scripts/gametypes";
import {ViewHistoryGameTabsPage} from "../view-history-game-tabs/view-history-game-tabs";
import {StorageService} from "../../providers/storage-service";

/*
  Generated class for the HistoryGames page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history-games',
  templateUrl: 'list-history-games.html'
})
export class ListHistoryGamesPage {

  historyGames;
  team : Team;
  constructor(public navCtrl: NavController, public storageService : StorageService) {
    this.historyGames = this.storageService.getHistoryGames();
    this.team = this.storageService.getCurrentTeam();
  }

  goToGame(game){
    this.storageService.setCurrentHistoryGame(game);
    this.navCtrl.push(ViewHistoryGameTabsPage);
  }

  deleteGame(game){
    this.historyGames.remove(game);
  }


  ionViewDidLoad() {

  }

}
