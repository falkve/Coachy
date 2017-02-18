import {Component} from '@angular/core';
import {NavController, ViewController, App} from "ionic-angular";
import {Util} from "../../assets/scripts/util";
import {Period, GamePlayer, ActiveGamePosition} from "../../assets/scripts/gametypes";
import {ViewHistoryGameTabsPage} from "../view-history-game-tabs/view-history-game-tabs";
import {StorageService} from "../../providers/storage-service";
import {ListHistoryGamesPage} from "../list-history-games/list-history-games";


@Component({
  selector: 'page-activegamestat',
  templateUrl: 'view-active-game-stat.html'
})
export class ViewActiveGameStatPage {

  currentGame;
  currentTeam;

  timeIntervalId = null;
  timer : string = ' ';
  isShowStartButton : boolean = false;



  constructor(public app: App, public navCtrl: NavController, public viewCtrl: ViewController, public storageService : StorageService) {
    this.currentGame = storageService.getCurrentGame();
    this.currentTeam = storageService.getCurrentTeam();
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

  showStartButton(){
    return this.currentGame.startTime == 0 && this.isShowStartButton;
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


  endPeriod(lastPeriod:boolean){
    this.endTimer();
    let date = new Date().getTime();
    this.currentGame.period.endTime = date;

    if(this.currentGame.periods == null){
      this.currentGame.periods = new Array<Period>();
    }
    this.currentGame.periods.push(this.currentGame.period);

    this.storageService.updateActiveGame(this.currentGame, ()=>{
      this.currentGame.period = null;
    });

    if(lastPeriod){
      if(this.currentGame.players == null){
        this.currentGame.players = new Array<GamePlayer>();
      }
      this.currentGame.endTime = date;
    }

    this.storageService.loadCurrentGamePlayers(this.currentTeam.id, this.currentGame.id, (snapshot)=>{
      snapshot.forEach((childSnapshot) => {
        let gamePlayer = childSnapshot.val();
        gamePlayer.position.endTime = date;
        if(lastPeriod){
          Util.addPositionStatistics(gamePlayer.player, gamePlayer.position);
        }
        if(gamePlayer.positions == null){
          gamePlayer.positions = new Array<ActiveGamePosition>();
        }
        gamePlayer.positions.push(Util.cloneActiveGamePosition(gamePlayer.position));
        gamePlayer.position.startTime = null;
        gamePlayer.position.endTime = null;

        if(lastPeriod){
          this.currentGame.players.push(gamePlayer);
          this.storageService.updatePlayer(gamePlayer.player);
        } else {
          this.storageService.updateCurrentGamePlayer(this.currentGame, gamePlayer);
        }
      });

      if(lastPeriod){
        this.storageService.addHistoryGame(this.currentGame, ()=>{
          this.storageService.setCurrentHistoryGame(this.currentGame);

          this.storageService.removeActiveGame(this.currentGame);

          this.app.getRootNav().setRoot(ListHistoryGamesPage)

        });
      }
    });




  }

  startPeriod(){
    let date = new Date().getTime();
    this.currentGame.period = new Period(this.currentGame.periods.length+1);
    this.currentGame.period.startTime = date;


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


    this.storageService.loadCurrentGamePlayers(this.currentTeam.id, this.currentGame.id, (snapshot)=>{
      if(snapshot.exists()){
        this.isShowStartButton = true;
      }
    });

  }

  ionViewWillLeave(){
    this.endTimer();
  }



}




