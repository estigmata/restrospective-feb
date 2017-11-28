import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamRoutingModule } from './team-routing.module';
import { TeamService } from './team.service';
import { CreateRetrospectiveComponent } from './create-retrospective/create-retrospective.component';
import { FormsModule } from '@angular/forms';
import { RetrospectiveTableComponent } from './retrospective-table/retrospective-table.component';
import { SingInUpComponent } from './sing-in-up/sing-in-up.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TeamRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    CreateRetrospectiveComponent,
    RetrospectiveTableComponent,
    SingInUpComponent
  ],
  exports: [
    CreateRetrospectiveComponent,
    RetrospectiveTableComponent
  ],
  providers: [
    TeamService
  ],
})
export class TeamModule { }
