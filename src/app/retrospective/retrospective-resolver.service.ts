import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Retrospective } from '../shared/retrospective.model';
import { RetrospectiveService } from './../shared/retrospective.service';
import { Observable } from 'rxjs/Observable';
import { ItemService } from './item.service';
import { Item } from './models/item.model';
import { ResolverData } from './models/resolver.model';

@Injectable()
export class RetrospectiveResolverService implements Resolve<ResolverData> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolverData> {
    return Observable.forkJoin(
        this.retrospectiveService.getRetrospectivesById(route.parent.params.id),
        this.itemService.getAll(route.parent.params.id))
      .map(([retrospective, items]) => {
        const res = new ResolverData(retrospective, items);
        const routeState = route.routeConfig.path.toLowerCase();
        const currentState = retrospective.state.toLowerCase();

        if (routeState === currentState || (currentState === 'done' && routeState === 'reports')) {
          return res;
        }
        if ( currentState === 'done') {
          this.router.navigate([`retrospective/${retrospective._id}/reports`]);
        } else {
          this.router.navigate([`retrospective/${retrospective._id}/${currentState}`]);
        }
      });
  }
  constructor(private retrospectiveService: RetrospectiveService, private router: Router, private itemService: ItemService) { }
}

