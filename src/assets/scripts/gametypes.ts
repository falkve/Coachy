/**
 * Created by vonfalk on 2017-01-01.
 */
export class Game{
  public id : string;
  public opponent: string;
  public startTime : number = 0;
  public endTime : number = 0;

  public goals : number = 0;
  public goalsOpponent : number = 0;

  public period : Period = null;

  public periods : Array<Period>;
  public players : Array<GamePlayer>;

  constructor(opponent: string) {
    this.opponent = opponent;
    this.periods = new Array<Period>();
    this.players = new Array<GamePlayer>();
  }
}

export class Player {

  public id : string;
  public name: string;
  public number: number;
  public positions : Map<string,number>;

  constructor(name: string, number: number) {
    this.name = name;
    this.number = number;
  }
}


export class Period{
  public period : number = 0;
  public startTime : number = 0;
  public endTime : number = 0;

  public goals : number = 0;
  public goalsOpponent : number = 0;

  constructor(period: number) {
    this.period = period;
  }

}

export class GamePosition{
  public name: string;
  public shorty : string
  public id : string;
  constructor(name: string, shorty : string) {
    this.name = name;
    this.shorty = shorty;
  }
}

export class ActiveGamePosition extends GamePosition{
  public startTime : number = 0;
  public endTime : number = 0;
}

export class Team{
  public id : string;
  public name : String;

  constructor(name: string) {
      this.name = name;
  }
}

export class GamePlayer{
  public name : string;
  public player : Player;
  public id : string;
  public position : ActiveGamePosition;

  public positions : Array<ActiveGamePosition>;


  constructor(player: Player, position: ActiveGamePosition) {
    this.player = player;
    this.position = position;
    this.name = player.name; //For sorting
    this.positions = new Array<ActiveGamePosition>();
  }

}



