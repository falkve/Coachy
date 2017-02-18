import { Component } from '@angular/core';
import { ModalController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {Team, Game, GamePosition, GamePlayer} from "../../assets/scripts/gametypes";
import {ChooseGamePositionPage} from "../choose-game-position/choose-game-position";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-chooseplayers',
  templateUrl: 'choose-player.html'
})
export class ChoosePlayersPage {
  team : Team;
  game : Game;
  players;
  positions = new Array <GamePosition>();

  nofPositionsSize = 0;
  usedPlayers = new Map<string, GamePlayer>();

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,public storageService : StorageService) {
    this.team = storageService.getCurrentTeam();
    this.game = storageService.getCurrentGame();
  }

  addPlayer(player){
    let profileModal = this.modalCtrl.create(ChooseGamePositionPage, { player: player, positions : this.positions });
    profileModal.onDidDismiss(data => {
      this.loadUsedPlayers();
    });
    profileModal.present();
  }


  loadUsedPlayers(){
    this.storageService.loadCurrentGamePlayers(this.team.id, this.game.id, (snapshot)=>{
        snapshot.forEach((childSnapshot) => {
          let player = childSnapshot.val().player;
          this.usedPlayers.set(player.id, player);
      });
      this.players = this.storageService.getPlayers();
    });
  }

  checkUsage(player){
    return this.usedPlayers.get(player.id) == null;
  }

  ngOnInit() {
    this.loadUsedPlayers();
  }
}



