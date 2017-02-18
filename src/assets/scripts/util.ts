import {Game, Player, SummarizedPosition, ActiveGamePosition, GamePlayer, Period} from "./gametypes";

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

  public static cloneSummarizedPosition(summarizedPosition){
    let newSummarizedPosition = new SummarizedPosition(summarizedPosition.positionId);
    newSummarizedPosition.time = summarizedPosition.time;
    newSummarizedPosition.nof = summarizedPosition.nof;
    return newSummarizedPosition;
  }

  public static clonePlayer(player){
    let newPlayer = new Player(player.name, player.number);
    newPlayer.id = player.id;

    newPlayer.positionsSummary = {};
    if(player.positionsSummary != null){
      for(let key in player.positionsSummary) {
        if (player.positionsSummary.hasOwnProperty(key)) {
          var value = player.positionsSummary[key];
          newPlayer.positionsSummary[key] = this.cloneSummarizedPosition(value);
        }
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
    let newPosition = null;
    if(gamePlayer.position != null){
      newPosition = Util.cloneActiveGamePosition(gamePlayer.position);
    }

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

  public static addPositionStatistics(player, position){
    let summarizedPosition = null;
    if(player.positionsSummary != null){
      summarizedPosition = player.positionsSummary[position.id];
    } else {
      player.positionsSummary = {};
    }
    if(summarizedPosition == null){
      summarizedPosition = new SummarizedPosition(position.id);
      summarizedPosition.nof = 1;
      summarizedPosition.time = (position.endTime - position.startTime);
      player.positionsSummary[position.id] = summarizedPosition;
    } else {
      player.positionsSummary[position.id].nof = (player.positionsSummary[position.id].nof+1);
      player.positionsSummary[position.id].time = (player.positionsSummary[position.id].time + (position.endTime - position.startTime));
    }
  }

  public static getElapsedTime(from, to){
    var timeDiff = to - from;
    return Util.calculateTime(timeDiff);
  }

  public static calculateTime(timeDiff){

    timeDiff /= 1000;
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


  public static hasNull(target) {
  for (var member in target) {
    if (target[member] == null)
      return true;
  }
  return false;
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


