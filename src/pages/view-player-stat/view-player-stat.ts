import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageService} from "../../providers/storage-service";
import {Player, SummarizedPosition} from "../../assets/scripts/gametypes";
import {Util} from "../../assets/scripts/util";

/*
  Generated class for the ViewPlayerStat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-player-stat',
  templateUrl: 'view-player-stat.html'
})
export class ViewPlayerStatPage {

  player : Player;
  statistics : Array<PlayerPositionHolder> = new Array<PlayerPositionHolder>();


  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService:StorageService) {
    let positionStatistics : Array<PlayerPositionHolder> = new Array<PlayerPositionHolder>();
    this.player = navParams.get('player');
    let tempPos = {};
    this.storageService.loadPositions(this.storageService.getCurrentTeam().id, (snapshot)=>{
      for(let key in snapshot.val()) {
        tempPos[snapshot.val()[key].id] = snapshot.val()[key];
      }

      for(let key in this.player.positionsSummary){
        let name = tempPos[key].name;
        let positionHolder = new PlayerPositionHolder(name, this.player.positionsSummary[key]);
        positionStatistics.push(positionHolder);
      }


      this.statistics = positionStatistics.sort((n1,n2) => {
        if (n2.summarizedPosition.time > n1.summarizedPosition.time) {
          return 1;
        }

        if (n2.summarizedPosition.time < n1.summarizedPosition.time) {
          return -1;
        }

        return 0;
      });

    });
  }

  formatTime(milliseconds){
    return Util.calculateTime(milliseconds).getTime();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPlayerStatPage');
  }

}

export class PlayerPositionHolder{
  public gamePositionName: string;
  public summarizedPosition : SummarizedPosition;

  constructor(gamePositionName: string, summarizedPosition : SummarizedPosition){
    this.gamePositionName = gamePositionName;
    this.summarizedPosition = summarizedPosition;
  }
}
