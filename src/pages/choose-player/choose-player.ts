import { Component } from '@angular/core';
import { ModalController} from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {Team, Game, GamePosition, GamePlayer, Player} from "../../assets/scripts/gametypes";
import {ChooseGamePositionPage} from "../choose-game-position/choose-game-position";
import {StorageService} from "../../providers/storage-service";
import {Util} from "../../assets/scripts/util";


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
  automaticSuggestionEnabled : boolean = true;
  automaticSuggestionEnabledHead : boolean = false;

  multipleSelectedUsers : {} = {};

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,public storageService : StorageService) {
    this.team = storageService.getCurrentTeam();
    this.game = storageService.getCurrentGame();
  }

  setPlayer(player){
    if(!this.automaticSuggestionEnabled){
      let profileModal = this.modalCtrl.create(ChooseGamePositionPage, { player: player, positions : this.positions });
      profileModal.onDidDismiss(data => {
        this.loadUsedPlayers();
      });
      profileModal.present();
    } else {
      if(this.multipleSelectedUsers[player.id] == null){
        this.multipleSelectedUsers[player.id] = player;
      } else {
        delete this.multipleSelectedUsers[player.id];
      }
    }
  }

  suggestPositions(){
    let mapOfPositions = {};
    this.storageService.loadPositions(this.team.id, (data) =>{
      for(let key in data.val()){
        mapOfPositions[key] = data.val()[key];
      }
      let gamePlayers = Util.suggestPositions(this.multipleSelectedUsers, mapOfPositions);
      for(let key in gamePlayers){
        this.storageService.addCurrentGamePlayer(this.game, gamePlayers[key],null);
      }
      this.navCtrl.parent.select(1);
    });

  }


  loadUsedPlayers(){
    this.storageService.loadCurrentGamePlayers(this.team.id, this.game.id, (snapshot)=>{
        snapshot.forEach((childSnapshot) => {
          let player = childSnapshot.val().player;
          this.usedPlayers.set(player.id, player);
      });
      this.automaticSuggestionEnabledHead = this.usedPlayers.size == 0;
      this.automaticSuggestionEnabled = this.noPlayerChosen();
      this.players = this.storageService.getPlayers();
    });
  }

  noPlayerChosen(){
    return this.automaticSuggestionEnabledHead;
  }

  checkUsage(player){
    return this.usedPlayers.get(player.id) == null;
  }

  ngOnInit() {
    this.loadUsedPlayers();
  }
}



