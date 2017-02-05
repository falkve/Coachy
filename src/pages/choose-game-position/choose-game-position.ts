import {Component, ElementRef} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {GamePosition, Team, Game, ActiveGamePosition, GamePlayer} from "../../assets/scripts/gametypes";
import {Player} from "../../assets/scripts/playertypes";
import {StorageService} from "../../providers/storage-service";

@Component({
  selector: 'page-choosegameposition',
  templateUrl: 'choose-game-position.html'
})
export class ChooseGamePositionPage {

  positions = new Array <GamePosition>();
  team : Team;
  game : Game;
  player : Player;

  currentGamePlayers;

  nofPositionsSize = 0;
  usedPositions = new Array<GamePosition>();

  constructor(public navCtrl: NavController, params: NavParams, public viewCtrl: ViewController, private ele: ElementRef, public storageService : StorageService) {
    this.player = params.get('player');
    this.team = storageService.getCurrentTeam();
    this.game = storageService.currentGame;
    this.currentGamePlayers = storageService.getCurrentGamePlayers();
  }

  loadPlayers(){
    this.storageService.loadCurrentGamePlayers(this.team.id, this.game.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let position = childSnapshot.val().position;
        this.usedPositions.push(position);
      });
      this.loadPositions();
    });
  }


  loadPositions(){
    let goalKeeper = false;
    this.storageService.loadPositions(this.team.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        this.nofPositionsSize++;
        let exists = false;
        let position = childSnapshot.val();
        for( let i=this.usedPositions.length-1; i>=0; i--) {
          if(this.usedPositions[i].id == 'GoalK'){

            goalKeeper = true;
          }
          if(position.id == this.usedPositions[i].id){
            exists = true;
            break;
          }
        }
        if(!exists){
          this.positions.push(position);
        }
      });
      if(!goalKeeper){
        let position = new GamePosition('Goalkeeper', 'GK');
        position.id = 'GoalK';
        this.positions.push(position);
      }

      let position = new GamePosition('Bench', 'B');
      position.id = 'Bench';
      this.positions.push(position);
    });





  }

  ngAfterViewInit() {
    this.loadPlayers();
    //this.ele.nativeElement.parentElement.setAttribute("class","OVERRIDE_choosegameposition "+ this.ele.nativeElement.parentElement.getAttribute("class"));
  }

  addPosition(position){
    let activeGamePosition = new ActiveGamePosition(position.name, position.shorty);
    activeGamePosition.id = position.id;
    let gamePlayer = new GamePlayer(this.player, activeGamePosition);
    if(this.game.players == null){
      this.game.players = new Array<GamePlayer>();
    }
    this.game.players.push(gamePlayer);
    this.storageService.updateActiveGame(this.game,()=>{
      this.close();
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }







}
