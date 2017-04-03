import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SummarizedPlayer, GamePosition} from "../../assets/scripts/gametypes";
import {Util} from "../../assets/scripts/util";
import {StorageService} from "../../providers/storage-service";

/*
  Generated class for the ViewGamePositionStat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-game-position-stat',
  templateUrl: 'view-game-position-stat.html'
})
export class ViewGamePositionStatPage {

  position : GamePosition;
  statistics : Array<PositionPlayerHolder> = new Array<PositionPlayerHolder>();


  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService:StorageService) {
    let playersStatistics : Array<PositionPlayerHolder> = new Array<PositionPlayerHolder>();
    this.position = navParams.get('position');
    let tempPlayer = {};
    this.storageService.loadPlayers(this.storageService.getCurrentTeam().id, (snapshot)=>{
      for(let key in snapshot.val()) {
        tempPlayer[snapshot.val()[key].id] = snapshot.val()[key];
      }

      for(let key in this.position.playersSummary){
        let name = tempPlayer[key].name;
        let positionHolder = new PositionPlayerHolder(name, this.position.playersSummary[key]);
        playersStatistics.push(positionHolder);
      }


      this.statistics = playersStatistics.sort((n1,n2) => {
        if (n2.summarizedPlayer.time > n1.summarizedPlayer.time) {
          return 1;
        }

        if (n2.summarizedPlayer.time < n1.summarizedPlayer.time) {
          return -1;
        }

        return 0;
      });

    });
  }

  formatTime(milliseconds){
    return Util.calculateTime(milliseconds).getTime();
  }

}


export class PositionPlayerHolder{
  public playerName: string;
  public summarizedPlayer : SummarizedPlayer;

  constructor(playerName: string, summarizedPlayer : SummarizedPlayer){
    this.playerName = playerName;
    this.summarizedPlayer = summarizedPlayer;
  }
}
