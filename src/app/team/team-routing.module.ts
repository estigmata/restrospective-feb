import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRetrospectiveComponent } from './create-retrospective/create-retrospective.component';
import { RetrospectiveTableComponent } from './retrospective-table/retrospective-table.component';
import { SingInUpComponent } from './sing-in-up/sing-in-up.component';

const routes: Routes = [
  { path: 'login', component: SingInUpComponent },
  { path: ':id/create-retrospective', component: CreateRetrospectiveComponent },
  { path: ':id', component: RetrospectiveTableComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TeamRoutingModule { }
