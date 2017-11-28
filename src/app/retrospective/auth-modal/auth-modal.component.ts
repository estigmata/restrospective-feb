import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, Output, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Player } from './../models/player.model';
import { PlayerService } from './../../shared/player.service';
import { Retrospective } from './../../shared/retrospective.model';
import { RetrospectiveService } from '../../shared/retrospective.service';
import { User } from './../../shared/user.model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  playerForm: FormGroup;
  @ViewChild('content') content;
  private retrospective: Retrospective;
  private ngbModal: NgbModalRef;
  private player = new Player('Anonymous', '', 'Participant');
  constructor(private modalService: NgbModal,
    private playerService: PlayerService,
    private userService: UserService,
    private retrospectiveService: RetrospectiveService,
    private fb: FormBuilder,
    private activedRouter: ActivatedRoute,
    private router: Router) {
      this.createForm();
    }

  ngOnInit() {

    this.activedRouter.params.switchMap(retrospectiveId => {
      this.player.retrospectiveId = retrospectiveId['id'];
      return this.retrospectiveService.getRetrospectivesById(retrospectiveId['id']);
    })
    .switchMap((retrospective: Retrospective) => {
      this.retrospective = retrospective;
      return this.userService.getUser();
    })
    .takeUntil(this.ngUnsubscribe)
    .subscribe((user: User) => {
      if (user) {
        this.player.name = user.name;
        this.player.userId = user._id;
        if (user._id === this.retrospective.owner) {
          this.player.role = 'Moderator';
        }
        this.setPlayer();
      } else {
        setTimeout(() => this.open(), 0);
      }
    });
  }

  open() {
    this.ngbModal = this.modalService.open(this.content);
    this.ngbModal.result.then((result) => {
      if (result === 'close') {
        this.setPlayer();
        return;
      }
      this.setPlayer();
      this.ngbModal.close();
    }, (reason) => {
      this.getDismissReason(reason);
      this.ngbModal.close();
    });
  }

  private getDismissReason(reason: any) {
    this.setPlayer();
  }

  private setPlayer() {
   this.playerService.setPlayer(this.player, this.retrospective._id)
   .switchMap((playerToken) => {
     return this.playerService.requestPlayer(playerToken);
   }) 
   .takeUntil(this.ngUnsubscribe)
    .subscribe((player: Player) => {
      this.router.navigate([`retrospective/${this.retrospective._id}/`]);
    });
  }

  createForm() {
    this.playerForm = this.fb.group({
        name: ['', Validators.compose([Validators.required, Validators.maxLength(1000)])]
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
