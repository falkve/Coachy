import {Component, ElementRef} from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {Team} from "../../assets/scripts/gametypes";
import {StorageService} from "../../providers/storage-service";



@Component({
  selector: 'page-team',
  templateUrl: 'add-team.html'
})
export class AddTeamPage {
  name:string;

  teams;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private ele: ElementRef, public storageService : StorageService) {
    this.teams = storageService.getTeams();

  }

  ngAfterViewInit() {
    //this.ele.nativeElement.parentElement.setAttribute("class","OVERRIDE_team "+ this.ele.nativeElement.parentElement.getAttribute("class"));
  }


  addTeam(){
    let team = new Team(this.name);
    this.storageService.addTeam(team);
    this.close();
  }

  close(){
    this.viewCtrl.dismiss();
  }



}




