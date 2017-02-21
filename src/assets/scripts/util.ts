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

  public static suggestSwitch(activePlayers : Array<GamePlayer>){

    let switchPlayers = new Array<PlayerSwitch>();
    let benchPlayers : Array<GamePlayer> = activePlayers.filter( d => {
      if(d.position.id == 'Bench'){
        return d;
      }
    });

    let fieldPlayers : Array<GamePlayer> = activePlayers.filter( d => {
      if(d.position.id != 'Bench' && d.position.id != 'GoalK'){
        return d;
      }
    });


    let sortedPlayers = fieldPlayers.sort((n1,n2) => {
      if (n1.position.startTime > n2.position.startTime) {
        return 1;
      }

      if (n1.position.startTime < n2.position.startTime) {
        return -1;
      }
      return 0;
    });

    let playersToSwitch : Array<GamePlayer> = sortedPlayers.splice(0, benchPlayers.length);

    for(let playerAKey in playersToSwitch){
      let playerA = playersToSwitch[playerAKey];
      let count : number = 0;
      let player : GamePlayer = null;
      let playerToRemoveFromList = null;
      for(let playerBKey in benchPlayers){
          let playerB = benchPlayers[playerBKey];
          if(playerA.player.id == playerB.player.id){
            continue;
          }
          let positionsSummaryMap = playerB.player.positionsSummary;
          if(positionsSummaryMap != null){
            let positionsSummary = playerB.player.positionsSummary[playerA.position.id];
            if(positionsSummary != null){
              if(player == null || positionsSummary.nof < count){
                player = playerB;
                playerToRemoveFromList = playerBKey;
              }
            } else {
              player = playerB;
              playerToRemoveFromList = playerBKey;
            }
          } else {
            player = playerB;
            playerToRemoveFromList = playerBKey;
          }
      }
      let playerSwitch = new PlayerSwitch(player, playerA)
      switchPlayers.push(playerSwitch);
      benchPlayers.splice(playerToRemoveFromList,1);
    }
    return switchPlayers;
  }

  public static changePlayer(storageService, currentGame, player, gamePlayer){

    if(currentGame.startTime != 0){
      let endTime = new Date().getTime();

      gamePlayer.position.endTime = endTime;
      player.position.endTime = endTime;

      if(gamePlayer.positions == null){
        gamePlayer.positions = new Array<ActiveGamePosition>();
      }
      if(player.positions == null){
        player.positions = new Array<ActiveGamePosition>();
      }
      gamePlayer.positions.push(Util.cloneActiveGamePosition(gamePlayer.position));
      player.positions.push(Util.cloneActiveGamePosition(player.position));

      Util.addPositionStatistics(gamePlayer.player, gamePlayer.position);
      Util.addPositionStatistics(player.player, player.position);


      let newDate = new Date().getTime();
      gamePlayer.position.startTime = newDate;
      player.position.startTime = newDate;
      gamePlayer.position.endTime = 0;
      player.position.endTime = 0;

    }

    let position = gamePlayer.position;
    gamePlayer.position = player.position;
    player.position = position;


    storageService.updateCurrentGamePlayer(currentGame, gamePlayer);
    storageService.updateCurrentGamePlayer(currentGame, player);
  }

  public static getPositionCount(player, positionKey){
    try{
      return player.positionsSummary[positionKey].time;
    } catch(e){
      return 0;
    }
  }

  public static suggestPositions(mapOfPlayers, mapOfPositions){
    let gamePlayers : Array<GamePlayer> = new Array<GamePlayer>();
    let nofBenchPlayers = Object.keys(mapOfPlayers).length - (Object.keys(mapOfPositions).length-1);

    //get BenchId
    let benchId = null;
    for(let key in mapOfPositions){
      if(mapOfPositions[key].name == 'Bench'){
        benchId = key;
      }
    }

    //pick becnhplayer first
    let counter = 0;
    while(counter < nofBenchPlayers){
      let player = null;
      for(let keyPlayer in mapOfPlayers){
        if(player == null){
          player = mapOfPlayers[keyPlayer];
        } else {
          if(Util.getPositionCount(player,'Bench') > Util.getPositionCount(mapOfPlayers[keyPlayer],'Bench')){
            player = mapOfPlayers[keyPlayer];
          }
        }
      }
      counter++;
      let activeGamePosition = new ActiveGamePosition(mapOfPositions[benchId].name, mapOfPositions[benchId].shorty);
      activeGamePosition.id = mapOfPositions[benchId].id;
      gamePlayers.push(new GamePlayer(player,activeGamePosition ));
      delete mapOfPlayers[player.id];
    }
    delete mapOfPositions[benchId];


    for(let key in mapOfPositions){
      let player = null;
      for(let keyPlayer in mapOfPlayers){
        if(player == null){
          player = mapOfPlayers[keyPlayer];
        } else {
          if(Util.getPositionCount(player,key) > Util.getPositionCount(mapOfPlayers[keyPlayer],key)){
            player = mapOfPlayers[keyPlayer];
          }
        }
      }
      let activeGamePosition = new ActiveGamePosition(mapOfPositions[key].name, mapOfPositions[key].shorty);
      activeGamePosition.id = mapOfPositions[key].id;
      gamePlayers.push(new GamePlayer(player, activeGamePosition));
      delete mapOfPlayers[player.id];

    }
    return gamePlayers;
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


export class PlayerSwitch{
  toField : GamePlayer;
  toBench : GamePlayer;

  constructor(toField : GamePlayer, toBench : GamePlayer){
    this.toBench = toBench;
    this.toField = toField;
  }
}



