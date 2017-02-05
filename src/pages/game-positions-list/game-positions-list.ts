import { Component } from '@angular/core';
import {NavController, ModalController, AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Team} from "../../assets/scripts/gametypes";
import {AddGamePositionPage} from "../add-game-position/add-game-position";
import {StorageService} from "../../providers/storage-service";

@Component({
  selector: 'page-gamepositions',
  templateUrl: 'game-positions-list.html'
})
export class GamePositionsListPage {

  gamePositions;
  team : Team;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private alertCtrl: AlertController, public storageService : StorageService) {
    this.gamePositions = storageService.getGamePositions();
    this.team = storageService.getCurrentTeam();
  }

  addPosition(){
    let profileModal = this.modalCtrl.create(AddGamePositionPage);
    profileModal.present();
  }

  deletePosition(gamePosition){
    this.gamePositions.remove(gamePosition);
    this.navCtrl.pop();
    this.navCtrl.push(GamePositionsListPage);
  }
}
