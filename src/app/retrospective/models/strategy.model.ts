import { Category } from './../../shared/category.model';

export class Strategy {
  constructor(
    public name: string,
    public categories?: Array<Category>,
    public _id?: string
    ) {}
}
