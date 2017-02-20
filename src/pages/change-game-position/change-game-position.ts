import {Component, ElementRef} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import 'rxjs/add/operator/map'
import {Util} from "../../assets/scripts/util";
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
    Util.changePlayer(this.storageService, this.currentGame, this.player, gamePlayer)
    this.close();
  }

  ngAfterViewInit() {
    //this.ele.nativeElement.parentElement.setAttribute("class","OVERRIDE_changeegameposition "+ this.ele.nativeElement.parentElement.getAttribute("class"));
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
