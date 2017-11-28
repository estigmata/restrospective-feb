import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetrospectiveModule } from './retrospective/retrospective.module';
import { TeamModule } from './team/team.module';

const routes: Routes = [
  { path: 'teams', loadChildren: 'app/team/team.module#TeamModule' },
  { path: 'retrospective', loadChildren: 'app/retrospective/retrospective.module#RetrospectiveModule' },
  { path: '',
    redirectTo: '/teams/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
