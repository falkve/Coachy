import {Game, Player} from "./gametypes";
import {GamePlayer, ActiveGamePosition, Period} from "../../../www/assets/scripts/gametypes";
/**
 * Created by vonfalk on 2017-01-04.
 */


export class Util{

  static generateId(prefix){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 36; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text = prefix + '_' + text;
    return text;
  }

  public static cloneGame(game){
      let newGame = new Game(game.opponent);
      newGame.id = game.id;
      newGame.startTime = game.startTime;
      newGame.endTime = game.endTime;
      newGame.goals = game.goals;
      newGame.goalsOpponent = game.goalsOpponent;
      newGame.period = game.period;

      if(game.periods != null){
        for (let period of game.periods) {
          let historyPeriod = Util.clonePeriod(period);
          newGame.periods.push(historyPeriod);
        }
      }
      if(game.players != null){
        for (let gamePlayer of game.players) {
          let historyPlayer = Util.cloneGamePlayer(gamePlayer);
          newGame.players.push(historyPlayer);
        }
    }

    return newGame;
  }

  public static clonePeriod(period){
    let newPeriod = new Period(period.period);
    newPeriod.endTime = period.endTime;
    newPeriod.startTime = period.startTime;
    newPeriod.goals = period.goals;
    newPeriod.goalsOpponent = period.goalsOpponent;
    return newPeriod;
  }

  public static clonePlayer(player){
    let newPlayer = new Player(player.name, player.number);
    newPlayer.id = player.id;
    if(player.positions != null){
      newPlayer.positions = new Map<string, number>();
      for (var key in player.positions) {
        var value = player.positions[key];
        newPlayer.positions.set(key, value);
      }
    }
    return newPlayer;
  }

  public static cloneActiveGamePosition(activePosition){
    let newPosition = new ActiveGamePosition(activePosition.name, activePosition.shorty);
    newPosition.id = activePosition.id;
    newPosition.startTime = activePosition.startTime;
    newPosition.endTime = activePosition.endTime;
    return newPosition;
  }

  public static cloneGamePlayer(gamePlayer){
    let newPlayer = Util.clonePlayer(gamePlayer.player);
    let newPosition = Util.cloneActiveGamePosition(gamePlayer.position);
    let newGamePlayer = new GamePlayer(newPlayer, newPosition);
    newGamePlayer.id = gamePlayer.id;

    if(gamePlayer.positions != null){
      for (let position of gamePlayer.positions) {
        let historyPosition = Util.cloneActiveGamePosition(position);
        newGamePlayer.positions.push(historyPosition);
      }
    }

    return newGamePlayer;
  }




  public static getElapsedTime(from, to){

      var timeDiff = to - from;

    // strip the ms
      timeDiff /= 1000;

    // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
      var seconds = Math.round(timeDiff % 60);

    // remove seconds from the date
      timeDiff = Math.floor(timeDiff / 60);

    // get minutes
    var minutes = Math.round(timeDiff % 60);

    // remove minutes from the date
    timeDiff = Math.floor(timeDiff / 60);

    // get hours
    var hours = Math.round(timeDiff % 24);

    // remove hours from the date
    timeDiff = Math.floor(timeDiff / 24);

    // the rest of timeDiff is number of days
    var days = timeDiff ;

    return new ElapsedTime(days, hours, minutes, seconds);
  }

}

export class ElapsedTime{

  days :string = '';
  hours :string = '';
  minutes :string = '';
  seconds :string = '';


  constructor(days, hours, minutes, seconds){
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  getTime(){
    return (this.days!=''?this.days+' d, ':'') +  (this.hours!=''?this.hours+' h, ':'') + (this.minutes!=''?this.minutes+' m, ':'') + this.seconds + ' s';
  }
}
