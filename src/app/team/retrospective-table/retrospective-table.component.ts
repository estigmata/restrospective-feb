import { Component, OnInit, OnDestroy } from '@angular/core';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { Retrospective } from '../../shared/retrospective.model';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-retrospective-table',
  templateUrl: './retrospective-table.component.html',
  styleUrls: ['./retrospective-table.component.css']
})

export class RetrospectiveTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public retrospectives: Retrospective[];
  constructor(private retrospectiveService: RetrospectiveService,  private router: Router) { }

  ngOnInit() {
    this.retrospectiveService.getRetrospectives()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(retrospectives => {
        this.retrospectives = retrospectives;
      },
      (error: Error) => {
        console.log('error');
      });
  }

  goToRetrospective(retrospectiveId) {
    this.router.navigate([`retrospective/${retrospectiveId}`]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
