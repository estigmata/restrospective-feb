import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DragDropDirectiveModule } from 'angular4-drag-drop';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { RetrospectiveComponent } from './retrospective.component';
import { RetrospectiveRoutingModule } from './retrospective-routing.module';
import { RetrospectiveResolverService } from './retrospective-resolver.service';
import { AddItemComponent } from './add-item/add-item.component';
import { CategoryComponent } from './category/category.component';
import { CategoryItemComponent } from './category-item/category-item.component';
import { ActionItemsComponent } from './action-items/action-items.component';
import { CreateActionItemComponent } from './create-action-item/create-action-item.component';
import { ItemSelectorComponent } from './item-selector/item-selector.component';
import { ItemService } from './item.service';
import { VoteItemComponent } from './vote-item/vote-item.component';
import { GroupItemComponent } from './group-item/group-item.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { ReportItemComponent } from './report-item/report-item.component';
import { RetrospectiveNavbarComponent } from './retrospective-navbar/retrospective-navbar.component';
import { OnFocusDirective } from './category-item/onfocus.directive';
import { ClientSocketService } from './service-socket/client-socket.service';
import { AuthGuard } from './auth-guard.service';
import { environment } from './../../environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { DragDropDirective } from './category-item/drag-drop.directive';

const config: SocketIoConfig = { url: `${environment.backendPath}`, options: { } };

@NgModule({
  imports: [
    CommonModule,
    DragDropDirectiveModule,
    RetrospectiveRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    SocketIoModule.forRoot(config)
  ],
  declarations: [
    RetrospectiveComponent,
    AddItemComponent,
    CategoryComponent,
    CategoryItemComponent,
    AuthModalComponent,
    ActionItemsComponent,
    VoteItemComponent,
    CreateActionItemComponent,
    ItemSelectorComponent,
    GroupItemComponent,
    ReportItemComponent,
    RetrospectiveNavbarComponent,
    OnFocusDirective,
    DragDropDirective
  ],
  exports: [
    RetrospectiveComponent,
    AddItemComponent,
    CategoryComponent,
    CategoryItemComponent,
    VoteItemComponent,
    AuthModalComponent
  ],
  providers: [
    RetrospectiveResolverService,
    ItemService,
    AuthGuard,
    ClientSocketService
  ],
})
export class RetrospectiveModule { }
