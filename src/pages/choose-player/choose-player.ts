import { Component } from '@angular/core';
import { ModalController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {Team, Game} from "../../assets/scripts/gametypes";
import {Player} from "../../assets/scripts/playertypes";
import {ChooseGamePositionPage} from "../choose-game-position/choose-game-position";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-chooseplayers',
  templateUrl: 'choose-player.html'
})
export class ChoosePlayersPage {
  team : Team;
  game : Game;
  players = new Array <Player>();
  positions;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,public storageService : StorageService) {
    this.team = storageService.getCurrentTeam();
    this.game = storageService.getCurrentGame();
    this.positions = storageService.getGamePositions();
  }

  addPlayer(player){
    let profileModal = this.modalCtrl.create(ChooseGamePositionPage, { player: player });
    profileModal.onDidDismiss(data => {
      this.loadPlayers();
    });

    profileModal.present();
  }

  loadPlayers(){
    this.players = new Array <Player>();
    this.storageService.loadPlayers(this.team.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let player = new Player(childSnapshot.val().name, childSnapshot.val().number);
        player.id = childSnapshot.key;
        this.players.push(player);
      });

      this.storageService.loadCurrentGamePlayers(this.team.id, this.game.id, (snapshot)=>{
        snapshot.forEach((childSnapshot) => {
          let playerId = childSnapshot.val().player.id;
          for( let i=this.players.length-1; i>=0; i--) {
            if( this.players[i].id == playerId) this.players.splice(i,1);
          }
        });
      });

    });
  }

  ngAfterViewInit() {
    this.loadPlayers();
  }
}



