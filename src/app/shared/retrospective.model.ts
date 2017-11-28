import { Category } from './category.model';

export class Retrospective {
  constructor(
    public name: string,
    public categories?: Array<Category>,
    public _id?: string,
    public owner?: string,
    public state?: string
  ) {}
}
