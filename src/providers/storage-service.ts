import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import * as firebase from "firebase";
import {Player, GamePosition, Team, Game, GamePlayer} from "../assets/scripts/gametypes";
import {Util} from "../assets/scripts/util";

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
        orderByChild: 'sortOrder'
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
    firebase.database().ref('/'+teamId+'/activeplayers/' + currentGameId + '/players').orderByChild('name').once('value', callbackFunc, this);
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

      let refPos = this.af.database.list('/' + team.id + '/positions');

      let positionGoalK = new GamePosition('Goalkeeper', 'GK');
      positionGoalK.id = 'GoalK';
      positionGoalK.sortOrder = "~";
      refPos.push(positionGoalK)

      let positionBench = new GamePosition('Bench', 'B');
      positionBench.id = 'Bench';
      positionBench.sortOrder = "~~";
      refPos.push(positionBench);
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
    this.af.database.list('/' + this.currentTeam.id + '/activeplayers/' + game.id + '/players').remove();
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
    this.currentGamePlayers = this.af.database.list('/' + this.currentTeam.id + '/activeplayers/' + game.id + '/players', {
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


  addCurrentGamePlayer(game, gamePlayer, callbackFunc){
    let gamePlayerCopy = Util.cloneGamePlayer(gamePlayer);
    let ref = firebase.database().ref('/'+this.currentTeam.id+'/activeplayers/' + game.id + '/players');
    let refId = ref.push();
    gamePlayerCopy.id = refId.key;
    refId.set(gamePlayerCopy).then(callbackFunc);
   }

  updateCurrentGamePlayer(game, gamePlayer){
    var copy = Util.cloneGamePlayer(gamePlayer);
    this.getCurrentGamePlayers().update(gamePlayer.id, copy);
  }

  updatePlayer(player){
    var copy = Util.clonePlayer(player);
    firebase.database().ref('/'+this.currentTeam.id+'/players/').child(player.id).once('value').then(data => {
      for(let key in player.positionsSummary) {
        var value = player.positionsSummary[key];
        let sumPos = null;
        if(data.val().positionsSummary != null){
          sumPos = data.val().positionsSummary[key];
        }
        if(sumPos != null){
          sumPos.nof = sumPos.nof + value.nof;
          sumPos.time = sumPos.time + value.time;
          copy.positionsSummary[key] = sumPos;
        } else {
          copy.positionsSummary[key] = value;
        }
      }

      for(let key in data.val().positionsSummary) {
        if(copy.positionsSummary[key] == null){
          copy.positionsSummary[key] = data.val().positionsSummary[key];
        }
      }
      this.getPlayers().update(copy.id, copy);
    });

  }

  updateGamePosition(position){
    var copy = Util.cloneGamePosition(position);
    firebase.database().ref('/'+this.currentTeam.id+'/positions/').child(position.id).once('value').then(data => {
      for(let key in position.playersSummary) {
        var value = position.playersSummary[key];
        let sumPos = null;
        if(data.val().playersSummary != null){
          sumPos = data.val().playersSummary[key];
        }
        if(sumPos != null){
          sumPos.nof = sumPos.nof + value.nof;
          sumPos.time = sumPos.time + value.time;
          copy.playersSummary[key] = sumPos;
        } else {
          copy.playersSummary[key] = value;
        }
      }

      for(let key in data.val().positionsSummary) {
        if(copy.playersSummary[key] == null){
          copy.playersSummary[key] = data.val().positionsSummary[key];
        }
      }
      this.getGamePositions().update(copy.id, copy);
    });

  }


  getCurrentTeam(){
    return this.currentTeam;
  }

}

