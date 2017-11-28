import { Item } from '../retrospective/models/item.model';

export class Category {
  constructor(
    public name: string,
    public color: string,
    public items: Array<Item>,
    public _id?: string
  ) {}
}
