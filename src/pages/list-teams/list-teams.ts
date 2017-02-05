import { Component } from '@angular/core';
import {NavController, LoadingController, ModalController} from 'ionic-angular';
import {StartPage} from "../start/start";
import {AddTeamPage} from "../add-team/add-team";
import {StorageService} from "../../providers/storage-service";

@Component({
  selector: 'page-teams',
  templateUrl: 'list-teams.html'
})
export class ListTeamsPage {

  teams;

  constructor(public navCtrl: NavController, public storageService : StorageService, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    this.teams = storageService.getTeams();
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.storageService.loadTeams((snapshot)=>{

      if(snapshot.exists()){
      } else {
        this.openAddTeam();
      }
      loading.dismiss();
    });
  }

  chooseTeam(team){
    this.storageService.initiate(team);
    //this.navCtrl.pop();
    this.navCtrl.setRoot(StartPage);
  }

  openAddTeam(){
    let profileModal = this.modalCtrl.create(AddTeamPage);
    profileModal.present();
  }

}
