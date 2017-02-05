import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ViewGamePlayerStatPage} from "../view-game-player-stat/view-game-player-stat";
import {StorageService} from "../../providers/storage-service";

@Component({
  selector: 'page-game-player-stat-list',
  templateUrl: 'list-game-player-stat.html'
})
export class ListGamePlayerStatPage {

  currentGamePlayers;

  constructor(public navCtrl: NavController, storageService : StorageService) {
    this.currentGamePlayers = storageService.getCurrentGame().players;
  }


  showPlayerStat(player){
    if(player.historyPositions != null){
      this.navCtrl.push(ViewGamePlayerStatPage,{
        player: player
      });
    }
  }
}
