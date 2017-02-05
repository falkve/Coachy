import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Player} from "../../www/assets/scripts/playertypes";
import {GamePosition, Team, Game, GamePlayer} from "../../www/assets/scripts/gametypes";
import {Util} from "../../www/assets/scripts/util";
import * as firebase from "firebase";

/*
  Generated class for the StorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StorageService {

  af: AngularFire;

  private players : FirebaseListObservable<Player[]>;
  private gamePositions : FirebaseListObservable<GamePosition[]>;
  private teams : FirebaseListObservable<Team[]>;

  private activeGames : FirebaseListObservable<Game[]>;
  private historyGames : FirebaseListObservable<Game[]>;

  private currentTeam : Team;
  currentGame : Game;
  currentHistoryGame : Game;

  private currentGamePlayers : FirebaseListObservable<GamePlayer[]>;

  constructor(af: AngularFire) {
    this.af = af;
    this.teams = this.af.database.list('/teams', {
      query: {
        orderByChild: 'name'
      }
    });
  }

  initiate(team : Team){
    this.currentTeam = team;

    let teamId = team.id;
    this.players = this.af.database.list('/' + teamId + '/players', {
      query: {
        orderByChild: 'name'
      }
    });

    this.gamePositions = this.af.database.list('/' + teamId + '/positions',{
      query: {
        orderByChild: 'name'
      }
    });

    this.activeGames = this.af.database.list('/' + teamId + '/activegames', {
      query: {
        orderByChild: 'opponent'
      }
    });

    this.historyGames = this.af.database.list('/' + teamId + '/historygames', {
      query: {
        orderByChild: 'startTime'
      }
    });
  }

  public loadTeams(callbackFunc){
    firebase.database().ref('/teams').orderByChild('name').once('value', callbackFunc, this);
  }

  public loadPositions(teamId, callbackFunc){
    firebase.database().ref('/'+teamId+'/positions').orderByChild('name').once('value', callbackFunc, this);
  }

  public loadPlayers(teamId, callbackFunc){
    firebase.database().ref('/'+teamId+'/players').orderByChild('name').once('value', callbackFunc, this);
  }

  public loadCurrentGamePlayers(teamId, currentGameId, callbackFunc){
    firebase.database().ref('/'+teamId+'/activegames/' + currentGameId + '/players').orderByChild('name').once('value', callbackFunc, this);
  }


  getPlayers(){
    return this.players;
  }
  addPlayer(player){
    this.players.push(player).then(ref => {
      player.id = ref.key;
      this.players.update(player.id, player);
    });
  }

  getGamePositions(){
    return this.gamePositions;
  }
  addGamePosition(position){
    this.gamePositions.push(position).then(ref => {
      position.id = ref.key;
      this.gamePositions.update(position.id, position);
    });
  }

  getTeams(){
    return this.teams;
  }
  addTeam(team){
    this.teams.push(team).then(ref => {
      team.id = ref.key;
      this.teams.update(team.id, team);
    });
  }


  getActiveGames(){
    return this.activeGames;
  }

  getHistoryGames(){
    return this.historyGames;
  }

  addActiveGame(game, callbackFunc){
    this.activeGames.push(game).then(ref => {
      game.id = ref.key;
      this.activeGames.update(game.id, game).then(callbackFunc);
    });
  }

  removeActiveGame(game){
    this.activeGames.remove(game.id);
  }

  addHistoryGame(game, callbackFunc){
    var copy = Util.cloneGame(game);
    copy.id = null;
    this.historyGames.push(copy).then(ref => {
      copy.id = ref.key;
      this.historyGames.update(copy.id, copy).then(callbackFunc);
    });
  }

  updateActiveGame(game, callbackFunc){
    var copy = Util.cloneGame(game);
    this.activeGames.update(copy.id, copy).then(callbackFunc);
  }

  public setCurrentGame(game){
    this.currentGame = game;
    this.currentGamePlayers = this.af.database.list('/' + this.currentTeam.id + '/activegames/' + game.id + '/players', {
      query: {
        orderByChild: 'position/startTime'
      }
    });
  }


  getCurrentGamePlayers(){
    return this.currentGamePlayers;
  }

  public setCurrentHistoryGame(game){
    this.currentHistoryGame = game;
  }

  public getCurrentGame(){
    return this.currentGame;
  }

  public getCurrentHistoryGame(){
    return this.currentHistoryGame;
  }


  /*addCurrentGamePlayer(gamePlayer, callbackFunc){
   this.currentGamePlayers.push(gamePlayer).then(ref => {
   gamePlayer.id = ref.key;
   this.currentGamePlayers.update(gamePlayer.id, gamePlayer).then(callbackFunc);
   });
   }*/
  updateCurrentGamePlayer(game, gamePlayer){
    var copy = Util.cloneGamePlayer(gamePlayer);
    this.currentGamePlayers.update(game.id, copy);
  }


  getCurrentTeam(){
    return this.currentTeam;
  }

}

