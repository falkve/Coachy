import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Util} from "../../assets/scripts/util";
import {ListGamePlayerStatPage} from "../list-game-player-stat/list-game-player-stat";


@Component({
  selector: 'page-game-player-stat',
  templateUrl: 'view-game-player-stat.html'
})
export class ViewGamePlayerStatPage {

  gamePlayer;
  constructor(public navCtrl: NavController,  params: NavParams) {
    this.gamePlayer = params.get('player');
  }




  calcTime(from, to){
    return Util.getElapsedTime(from,to).getTime();
  }

  formatDate(dateLong){
    let d = new Date(dateLong);
    return d;
  }

  ionViewWillLeave() {
    this.navCtrl.push(ListGamePlayerStatPage);
  }

}
