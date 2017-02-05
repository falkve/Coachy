import {Component, ViewChild} from '@angular/core';
import {ChoosePlayersPage} from "../choose-player/choose-player";
import {Tabs, NavController} from "ionic-angular";
import {Game, Team} from "../../assets/scripts/gametypes";
import {ViewActiveGamePage} from "../view-active-game/view-active-game";
import {ListGamePlayerStatPage} from "../list-game-player-stat/list-game-player-stat";
import {ViewActiveGameStatPage} from "../view-active-game-stat/view-active-game-stat";
import {StorageService} from "../../providers/storage-service";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('gametabs') tabRef: Tabs;

  game : Game;
  team : Team;

  playerRoot: any = ChoosePlayersPage;
  activeGameRoot: any = ViewActiveGamePage;
  activePlayersPage : any = ListGamePlayerStatPage;
  activeGameStatRoot: any = ViewActiveGameStatPage;

  constructor(storageService : StorageService, private nav: NavController) {
    this.team = storageService.getCurrentTeam();
    this.game = storageService.getCurrentGame();

  }

  ionViewDidEnter() {
    if(this.game.startTime == 0) {
      this.tabRef.select(3);
    }
  }

}
