import {Component} from '@angular/core';
import { ModalController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AddPlayerPage } from "../add-player/add-player";
import {Team} from "../../assets/scripts/gametypes";
import {StorageService} from "../../providers/storage-service";
import {ViewPlayerStatPage} from "../view-player-stat/view-player-stat";

@Component({
  selector: 'page-player',
  templateUrl: 'list-players.html'
})
export class ListPlayersPage {

  players;
  team : Team;
  public orientationX : string;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public storageService : StorageService) {
    this.players = storageService.getPlayers();
    this.team = storageService.getCurrentTeam();


/*    window.addEventListener('orientationchange', () => {
      console.info('DEVICE ORIENTATION CHANGED!');
      console.debug(ScreenOrientation.orientation);
      switch (window.orientation) {
        case -90:
          console.log("-90");
          this.orientationX = "-90";
        case 90:
          console.log("Landscape orientation");
          this.orientationX = "Landscape orientation";
          break;
        case 0:
          console.log("Landscape orientation");
          this.orientationX = "Landscape orientation";
          break;
      }
    });*/





    /*window.addEventListener("orientationchange", () => {
      this.orientationX = ScreenOrientation.orientation.valueOf();
    });*/
  }

  viewPlayerStat(player){
    this.navCtrl.push(ViewPlayerStatPage, { player: player});
  }

  addPlayer(){
    let profileModal = this.modalCtrl.create(AddPlayerPage);
    profileModal.present();
  }

  deletePlayer(player){
    this.players.remove(player);
  }
}


