import { PlayerColor } from './player.model';

export class Item {
  constructor(
    public playerId: string | PlayerColor,
    public categoryId: string,
    public retrospectiveId?: string,
    public actionItem?: string,
    public children?: Array<Item>,
    public editMode?: boolean,
    public summary?: string,
    public votes?: number,
    public _id?: string,
    public currentVotes?: number,
    public color?: string,
    public categoryName?: string,
    public parent?: boolean,
    public categoryColor?: string
  ) {}
}
