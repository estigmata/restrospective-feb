import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetrospectiveComponent } from './retrospective.component';
import { AddItemComponent } from './add-item/add-item.component';
import { VoteItemComponent } from './vote-item/vote-item.component';
import { RetrospectiveResolverService } from './retrospective-resolver.service';
import { ActionItemsComponent } from './action-items/action-items.component';
import { GroupItemComponent } from './group-item/group-item.component';
import { ReportItemComponent } from './report-item/report-item.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { AuthGuard } from './auth-guard.service';


const routes: Routes = [
  { path: ':id',
    component: RetrospectiveComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'actions', component: ActionItemsComponent,
        resolve: {
          resolverData: RetrospectiveResolverService
        }
      },
      { path: 'items', component: AddItemComponent,
        resolve: {
          resolverData: RetrospectiveResolverService
        }
      },
      { path: 'grouping', component: GroupItemComponent,
        resolve: {
          resolverData: RetrospectiveResolverService
        }
      },
      { path: 'votes', component: VoteItemComponent,
        resolve: {
          resolverData: RetrospectiveResolverService
        }
      },
      { path: 'reports', component: ReportItemComponent,
        resolve: {
          resolverData: RetrospectiveResolverService
        }
      },
      { path: '', redirectTo: 'items', pathMatch: 'full' }
    ]
  },
  { path: ':id/login', component: AuthModalComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RetrospectiveRoutingModule { }
