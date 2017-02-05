import {Component, ElementRef} from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {FirebaseListObservable} from "angularfire2";
import {Game} from "../../assets/scripts/gametypes";
import {StorageService} from "../../providers/storage-service";


@Component({
  selector: 'page-game',
  templateUrl: 'add-game.html'
})
export class AddGamePage {
  opponent : string;
  activeGames : FirebaseListObservable<Game[]>;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private ele: ElementRef, public storageService : StorageService) {
    this.activeGames = storageService.getActiveGames();
  }

  ngAfterViewInit() {
    this.ele.nativeElement.parentElement.setAttribute("class","OVERRIDE_game "+ this.ele.nativeElement.parentElement.getAttribute("class"));
  }

  addGame(){
    let game = new Game(this.opponent);
    this.storageService.addActiveGame(game, ()=>{
      this.storageService.setCurrentGame(game);
      this.close(true);
    });
  }

  close(isAdded : Boolean){
    this.viewCtrl.dismiss(isAdded);
  }
}




