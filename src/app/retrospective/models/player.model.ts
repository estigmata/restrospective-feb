class Player {
    constructor(
    public name: string,
    public retrospectiveId: string,
    public role: string,
    public votes?: Array<any>,
    public maxVotes?: number,
    public _id?: string,
    public color?: string,
    public userId?: string) {}
}

class PlayerColor {
   constructor (
    public _id: string,
    public color: string
   ) {}
}

class PlayerToken {
  constructor(
    public playerToken: string
  ) {}
}

export {
    Player,
    PlayerColor,
    PlayerToken
};
