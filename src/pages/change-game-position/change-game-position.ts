import {Component, ElementRef} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import 'rxjs/add/operator/map'
import {Util} from "../../assets/scripts/util";
import {ActiveGamePosition} from "../../assets/scripts/gametypes";
import {StorageService} from "../../providers/storage-service";

/*
  Generated class for the ChangeGamePosition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-change-game-position',
  templateUrl: 'change-game-position.html'
})
export class ChangeGamePositionPage {


  player;
  currentGame;
  currentPlayers;
  constructor(public navCtrl: NavController, private ele: ElementRef, public storageService : StorageService, params: NavParams, public viewCtrl : ViewController) {
    this.player = params.get('player');
    this.currentGame = storageService.getCurrentGame();
    this.currentPlayers = storageService.getCurrentGamePlayers();
  }


  changePosition(gamePlayer){

    if(this.currentGame.startTime != null){
      let endTime = new Date().getTime();

      gamePlayer.position.endTime = endTime;
      this.player.position.endTime = endTime;

      if(gamePlayer.positions == null){
        gamePlayer.positions = new Array<ActiveGamePosition>();
      }
      if(this.player.positions == null){
        this.player.positions = new Array<ActiveGamePosition>();
      }
      gamePlayer.positions.push(Util.cloneActiveGamePosition(gamePlayer.position));
      this.player.positions.push(Util.cloneActiveGamePosition(this.player.position));


      let newDate = new Date().getTime();
      gamePlayer.position.startTime = newDate;
      this.player.position.startTime = newDate;
      gamePlayer.position.endTime = 0;
      this.player.position.endTime = 0;

    }

    let position = gamePlayer.position;
    gamePlayer.position = this.player.position;
    this.player.position = position;


    this.storageService.updateCurrentGamePlayer(this.currentGame, gamePlayer);
    this.storageService.updateCurrentGamePlayer(this.currentGame, this.player);

    /*this.currentGame.players.update(gamePlayer);
    this.currentGame.players.update(this.player);
    this.storageService.updateActiveGame(this.currentGame,()=>{

    });*/




    this.close();
  }

  ngAfterViewInit() {
    //this.ele.nativeElement.parentElement.setAttribute("class","OVERRIDE_changeegameposition "+ this.ele.nativeElement.parentElement.getAttribute("class"));
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
