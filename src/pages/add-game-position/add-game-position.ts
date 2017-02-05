import {Component, ElementRef} from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {GamePosition} from "../../assets/scripts/gametypes";
import {StorageService} from "../../providers/storage-service";



@Component({
  selector: 'page-gameposition',
  templateUrl: 'add-game-position.html'
})
export class AddGamePositionPage {

  name:string;
  shorty:string;

  gamePositions;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private ele: ElementRef, public storageService : StorageService) {
    this.gamePositions = storageService.getGamePositions();
  }

  ngAfterViewInit() {
    this.ele.nativeElement.parentElement.setAttribute("class","OVERRIDE_gameposition "+ this.ele.nativeElement.parentElement.getAttribute("class"));
  }

  createShortVersion(){
    this.shorty = this.name.substring(0,0);
  }

  addGamePosition(){
    let gamePosition = new GamePosition(this.name, this.shorty);
    this.storageService.addGamePosition(gamePosition);
    this.close();
  }

  close(){
    this.viewCtrl.dismiss();
  }
}




