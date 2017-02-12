import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ViewGamePlayerStatPage} from "../view-game-player-stat/view-game-player-stat";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-game-player-stat-list',
  templateUrl: 'list-history-game-player-stat.html'
})
export class ListHistoryGamePlayerStatPage {

  currentHistoryGamePlayers;

  constructor(public navCtrl: NavController, storageService : StorageService) {
    this.currentHistoryGamePlayers = storageService.getCurrentHistoryGame().players;
  }


  showPlayerStat(player){
    if(player.historyPositions != null){
      this.navCtrl.push(ViewGamePlayerStatPage,{
        player: player
      });
    }
  }
}
