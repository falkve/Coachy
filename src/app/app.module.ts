import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CoachAssistantApp } from './app.component';
import { ListPlayersPage } from '../pages/list-players/list-players';
import { TabsPage } from '../pages/tabs/tabs';
import {AddPlayerPage} from "../pages/add-player/add-player";
import {AngularFireModule} from "angularfire2";
import {LoginPage} from "../pages/login/login";
import {StartPage} from "../pages/start/start";
import {AddGamePositionPage} from "../pages/add-game-position/add-game-position";
import {AddGamePage} from "../pages/add-game/add-game";
import {ListGamesPage} from "../pages/list-games/list-games";
import {GamePositionsListPage} from "../pages/game-positions-list/game-positions-list";
import {AddTeamPage} from "../pages/add-team/add-team";
import {ListTeamsPage} from "../pages/list-teams/list-teams";
import {ChoosePlayersPage} from "../pages/choose-player/choose-player";
import {ViewActiveGamePage} from "../pages/view-active-game/view-active-game";
import {ViewActiveGameStatPage} from "../pages/view-active-game-stat/view-active-game-stat";
import {ChooseGamePositionPage} from "../pages/choose-game-position/choose-game-position";
import {ViewGamePlayerStatPage} from "../pages/view-game-player-stat/view-game-player-stat";
import {ListGamePlayerStatPage} from "../pages/list-game-player-stat/list-game-player-stat";
import {ChangeGamePositionPage} from "../pages/change-game-position/change-game-position";
import {BasetabsPage} from "../pages/basetabs/basetabs";
import {ListHistoryGamesPage} from "../pages/list-history-games/list-history-games";
import {ViewHistoryGameTabsPage} from "../pages/view-history-game-tabs/view-history-game-tabs";
import {ListHistoryGamePlayerStatPage} from "../pages/list-history-game-player-stat/list-history-game-player-stat";
import {ViewHistoryGamePage} from "../pages/view-history-game/view-history-game";
import {StorageService} from "../providers/storage-service";
import {ViewPlayerStatPage} from "../pages/view-player-stat/view-player-stat";
import {ViewGamePositionStatPage} from "../pages/view-game-position-stat/view-game-position-stat";

export const firebaseConfig = {
  apiKey: "AIzaSyAZXxk_yvqzmzvljKQTa7zFtCE5pRVZuKQ",
  authDomain: "coachassistant-500d7.firebaseapp.com",
  databaseURL: "https://coachassistant-500d7.firebaseio.com",
  storageBucket: "coachassistant-500d7.appspot.com",
  messagingSenderId: "452645135599"
};

@NgModule({
  declarations: [
    CoachAssistantApp,
    GamePositionsListPage,
    AddGamePositionPage,
    ListPlayersPage,
    TabsPage,
    AddPlayerPage,
    LoginPage,
    StartPage,
    AddGamePage,
    ListGamesPage,
    AddTeamPage,
    ListTeamsPage,
    ChoosePlayersPage,
    ViewActiveGamePage,
    ViewActiveGameStatPage,
    ChooseGamePositionPage,
    ViewGamePlayerStatPage,
    ListGamePlayerStatPage,
    ChangeGamePositionPage,
    BasetabsPage,
    ListHistoryGamesPage,
    ViewHistoryGameTabsPage,
    ListHistoryGamePlayerStatPage,
    ViewHistoryGamePage,
    ViewPlayerStatPage,
    ViewGamePositionStatPage
  ],
  imports: [
    IonicModule.forRoot(CoachAssistantApp),
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CoachAssistantApp,
    GamePositionsListPage,
    AddGamePositionPage,
    ListPlayersPage,
    TabsPage,
    AddPlayerPage,
    LoginPage,
    StartPage,
    AddGamePage,
    ListGamesPage,
    AddTeamPage,
    ListTeamsPage,
    ChoosePlayersPage,
    ViewActiveGamePage,
    ViewActiveGameStatPage,
    ChooseGamePositionPage,
    ViewGamePlayerStatPage,
    ListGamePlayerStatPage,
    ChangeGamePositionPage,
    BasetabsPage,
    ListHistoryGamesPage,
    ViewHistoryGameTabsPage,
    ListHistoryGamePlayerStatPage,
    ViewHistoryGamePage,
    ViewPlayerStatPage,
    ViewGamePositionStatPage,

  ],
  providers: [StorageService,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
