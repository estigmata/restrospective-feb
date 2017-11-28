import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { RetrospectiveService } from './../shared/retrospective.service';
import { Retrospective } from '../shared/retrospective.model';
import { PlayerService } from '../shared/player.service';
import { Player } from './models/player.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.css']
})
export class RetrospectiveComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private retrospective: Retrospective;
  private listSubscription: Subscription;
  private player;
  private retrospectiveIsDefined = false;
  constructor(
    private retrospectiveService: RetrospectiveService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params
    .switchMap(param => {
      return this.retrospectiveService.getRetrospectivesById(param['id']);
    })
    .takeUntil(this.ngUnsubscribe)
    .subscribe((currentRetrospective: Retrospective) => {
      this.retrospective = currentRetrospective;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
