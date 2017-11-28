import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from './../../shared/category.model';
import { Retrospective } from './../../shared/retrospective.model';
import { RetrospectiveService } from './../../shared/retrospective.service';
import { UserService } from '../../shared/user.service';
import { Strategy } from './../models/strategy.model';
import { User } from './../../shared/user.model';
import { STRATEGY_CONST } from './strategy.constanst';

@Component({
  selector: 'app-create-retrospective',
  templateUrl: './create-retrospective.component.html',
  styleUrls: ['./create-retrospective.component.css']
})

export class CreateRetrospectiveComponent implements OnInit {
  strategies;
  createRetrospectiveForm: FormGroup;
  selectedStrategy: Strategy;
  constructor(private fb: FormBuilder,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private userService: UserService) {
    this.createRetrospectiveForm = this.fb.group({
        name: ['', Validators.required]
    });
    this.strategies = STRATEGY_CONST;
    this.selectedStrategy = this.strategies[0];
   }

  ngOnInit() {
  }

  onChange(strategy) {
     this.selectedStrategy = strategy;
  }

  onSubmit(value: any): void {
    const newRetrospective = new Retrospective(value.name, this.selectedStrategy.categories);
    let userToken = this.userService.getUserToken();
    console.log("retro a crear: ", userToken);
    this.retrospectiveService.createRetrospective(userToken, newRetrospective).subscribe((retrospective: Retrospective) => {
      this.router.navigate([`retrospective/${retrospective._id}`]);
    });
  }
}
