import {enableProdMode, Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {ListTeamsPage} from "../pages/list-teams/list-teams";
import {LoginPage} from "../pages/login/login";
import {ListPlayersPage} from "../pages/list-players/list-players";
import {GamePositionsListPage} from "../pages/game-positions-list/game-positions-list";
import {ListGamesPage} from "../pages/list-games/list-games";
import {ListHistoryGamesPage} from "../pages/list-history-games/list-history-games";

import {} from '@angular/core';

enableProdMode();


@Component({
  templateUrl: 'app.html'
})
export class CoachAssistantApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListTeamsPage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: LoginPage },
      { title: 'Players', component: ListPlayersPage },
      { title: 'Positions', component: GamePositionsListPage },
      { title: 'Games', component: ListGamesPage },
      { title: 'History', component: ListHistoryGamesPage },
      { title: 'Switch Team', component: ListTeamsPage }
      // { title: 'History', component: TabsPage }
      //{ title: 'My First List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
