import {Component, ViewChild} from '@angular/core';
import {NavController, Tabs} from 'ionic-angular';
import {ViewHistoryGamePage} from "../view-history-game/view-history-game";
import {ListHistoryGamePlayerStatPage} from "../list-history-game-player-stat/list-history-game-player-stat";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-view-history-game-tabs',
  templateUrl: 'view-history-game-tabs.html'
})
export class ViewHistoryGameTabsPage {

  @ViewChild('historyGameTabs') tabRef: Tabs;

  team;
  currentHistoryGame;


  gameRoot: any = ViewHistoryGamePage;
  historyPlayersPage : any = ListHistoryGamePlayerStatPage;

  constructor(storageService : StorageService, private nav: NavController) {
    this.team = storageService.getCurrentTeam();
    this.currentHistoryGame = storageService.getCurrentHistoryGame()

  }


}
