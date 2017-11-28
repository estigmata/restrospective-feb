
import { Item } from './item.model';
import { Retrospective } from './../../shared/retrospective.model';

export class ResolverData {
  constructor(
    public retrospective?: Retrospective,
    public items?: Item []
  ) {}
}
