import {Component} from '@angular/core';
import {NavController, ViewController, App} from "ionic-angular";
import {Util} from "../../assets/scripts/util";
import {Period, GamePlayer, ActiveGamePosition} from "../../assets/scripts/gametypes";
import {ViewHistoryGameTabsPage} from "../view-history-game-tabs/view-history-game-tabs";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-activegamestat',
  templateUrl: 'view-active-game-stat.html'
})
export class ViewActiveGameStatPage {

  currentGame;
  currentTeam;
  //currentGamePlayers;

  timeIntervalId = null;
  timer : string = ' ';



  constructor(public app: App, public navCtrl: NavController, public viewCtrl: ViewController, public storageService : StorageService) {
    this.currentGame = storageService.getCurrentGame();
    this.currentTeam = storageService.getCurrentTeam();
    //this.currentGamePlayers = storageService.getCurrentGamePlayers();
  }

  addGoal(who){
    if(who == this.currentTeam.name){
      this.currentGame.goals ++;
      this.currentGame.period.goals ++;
    } else {
      this.currentGame.goalsOpponent ++;
      this.currentGame.period.goalsOpponent ++;
    }
    this.storageService.updateActiveGame(this.currentGame,()=>{

    });
  }
  startTimer(){
    this.timeIntervalId = setInterval(()=>this.updateTime(), 1000);
  }

  endTimer(){
    clearInterval(this.timeIntervalId);
    this.timeIntervalId = null;
  }

  private updateTime(){
     let d = new Date()
    try{
      this.timer = Util.getElapsedTime(this.currentGame.period.startTime,d.getTime()).getTime();
    } catch (e){
       return '';
    }

  }

  get currentTime(){
    try{
      return this.timer;
    } catch(e){
      return '';
    }
  }

  startGame(){
    let date = new Date().getTime();

    this.storageService.loadCurrentGamePlayers(this.currentTeam.id, this.currentGame.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let gamePlayer = childSnapshot.val();
        gamePlayer.position.startTime = date;
        this.storageService.updateCurrentGamePlayer(this.currentGame, gamePlayer);
      });
    });


    this.currentGame.startTime = date;
    this.currentGame.period = new Period(1);
    this.currentGame.period.startTime = date;
    this.storageService.updateActiveGame(this.currentGame,()=>{
      this.startTimer();
    });

  }

  endGame(){
    if(this.currentGame.period != null){
      this.endPeriod();
    }

    let date = new Date().getTime();
    this.currentGame.endTime = date;

    if(this.currentGame.players == null){
      this.currentGame.players = new Array<GamePlayer>();
    }

    this.storageService.loadCurrentGamePlayers(this.currentTeam.id, this.currentGame.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let gamePlayer = childSnapshot.val();
        gamePlayer.position = null;
        this.currentGame.players.push(gamePlayer);
      });
    });

    this.storageService.addHistoryGame(this.currentGame, ()=>{
      this.storageService.setCurrentHistoryGame(this.currentGame);

      this.storageService.removeActiveGame(this.currentGame);
      const ANIMATION = { animate: true, direction: 'back' };
      this.app.getRootNav().push(ViewHistoryGameTabsPage, null, ANIMATION)


    });


  }

  endPeriod(){
    this.endTimer();
    let date = new Date().getTime();
    this.currentGame.period.endTime = date;

    this.storageService.loadCurrentGamePlayers(this.currentTeam.id, this.currentGame.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let gamePlayer = childSnapshot.val();
        gamePlayer.position.endTime = date;
        if(gamePlayer.positions == null){
          gamePlayer.positions = new Array<ActiveGamePosition>();
        }
        gamePlayer.positions.push(Util.cloneActiveGamePosition(gamePlayer.position));
        gamePlayer.position.startTime = null;
        gamePlayer.position.endTime = null;
        this.storageService.updateCurrentGamePlayer(this.currentGame, gamePlayer);
      });
    });

    /*for( let i=0; i < this.currentGame.players.length; i++) {
      this.currentGame.players[i].position.endTime = date;
      if(this.currentGame.players[i].historyPositions == null) {
        this.currentGame.players[i].historyPositions = new Array<ActiveGamePosition>();
      }

      this.currentGame.players[i].historyPositions.push(Util.cloneActiveGamePosition(this.currentGame.players[i].position));
      this.currentGame.players[i].position.startTime = null;
      this.currentGame.players[i].position.endTime = null;
    }*/




    if(this.currentGame.periods == null){
      this.currentGame.periods = new Array<Period>();
    }
    this.currentGame.periods.push(this.currentGame.period);

    this.storageService.updateActiveGame(this.currentGame, ()=>{
      this.currentGame.period = null;
    });

  }

  startPeriod(){
    let date = new Date().getTime();
    this.currentGame.period = new Period(this.currentGame.periods.length+1);
    this.currentGame.period.startTime = date;

    /*for( let i=0; i < this.currentGame.players.length; i++) {
      this.currentGame.players[i].position.startTime = date;
      this.currentGame.players[i].position.endTime = null;
    }*/

    this.storageService.loadCurrentGamePlayers(this.currentTeam.id, this.currentGame.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let gamePlayer = childSnapshot.val();
        gamePlayer.position.startTime = date;
        gamePlayer.position.endTime = null;
        this.storageService.updateCurrentGamePlayer(this.currentGame,  gamePlayer);
      });
    });

    this.storageService.updateActiveGame(this.currentGame,()=>{
      this.startTimer();
    });

  }



  ionViewWillEnter() {
    if (this.currentGame.period != null && this.timeIntervalId == null) {
      this.updateTime();
      this.startTimer();
    }
  }

  ionViewWillLeave(){
    this.endTimer();
  }



}




