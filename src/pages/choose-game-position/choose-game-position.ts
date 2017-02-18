import {Component, ElementRef} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {GamePosition, Team, Game, ActiveGamePosition, GamePlayer, Player} from "../../assets/scripts/gametypes";
import {StorageService} from "../../providers/storage-service";





@Component({
  selector: 'page-choosegameposition',
  templateUrl: 'choose-game-position.html'
})




export class ChooseGamePositionPage {

  positions;
  extraPositions = new Array<GamePosition>();
  team : Team;
  game : Game;
  player : Player;

  currentGamePlayers;
  usedPositions = new Map<string, GamePosition>();





  constructor(public navCtrl: NavController, params: NavParams, public viewCtrl: ViewController, private ele: ElementRef, public storageService : StorageService) {
    this.player = params.get('player');
    this.positions = storageService.getGamePositions();
    this.team = storageService.getCurrentTeam();
    this.game = storageService.currentGame;
  }

  checkUsage(position){
    if(position.id == 'Bench'){
      return true;
    } else {
      return this.usedPositions.get(position.id) == null;
    }
  }

  loadUsedPositions(){
    this.storageService.loadCurrentGamePlayers(this.team.id, this.game.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let position = childSnapshot.val().position;
        this.usedPositions.set(position.id, position);
      });
      this.currentGamePlayers = this.storageService.getCurrentGamePlayers();
    });
  }

  ngOnInit() {
    this.loadUsedPositions();
  }

  addPosition(position){
    let activeGamePosition = new ActiveGamePosition(position.name, position.shorty);
    activeGamePosition.id = position.id;

    let gamePlayer = new GamePlayer(this.player, activeGamePosition);
    gamePlayer.player.positionsSummary = null;
    this.storageService.addCurrentGamePlayer(this.game, gamePlayer, ()=>{
      this.close();
    });

  }

  close(){
    this.viewCtrl.dismiss();
  }







}
