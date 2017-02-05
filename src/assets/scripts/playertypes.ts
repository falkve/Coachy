/**
 * Created by vonfalk on 2016-12-25.
 */
export class Player {

  public id : string;
  public name: string;
  public number: number;


  constructor(name: string, number: number) {
    this.name = name;
    this.number = number;
  }

  /*public  fromJson(userJson: any): Player {
    var player = new Player(userJson.name, userJson.number);
    return player;
  }

  public toJson(){
    return JSON.stringify(this);
  }*/
}



