import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../shared/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';
import { Token } from './../models/token.model';
@Component({
  selector: 'app-sing-in-up',
  templateUrl: './sing-in-up.component.html',
  styleUrls: ['./sing-in-up.component.css']
})
export class SingInUpComponent implements OnInit {
  createUserForm: FormGroup;
  authenticateUserForm: FormGroup;
  constructor(private fb: FormBuilder,
              private config: NgbTabsetConfig,
              private userService: UserService,
              private route: Router) {

  this.config.justify = 'end';

  this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

   this.authenticateUserForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  ngOnInit() {
  }

  onCreateUser(user) {
    this.userService.createUser(user)
      .subscribe( (tokenObject: Token) => {
        const decodeToken = this.userService.decodeTokenUser(tokenObject.userToken);
        localStorage.setItem('token','bearer ' + tokenObject.userToken);
        this.userService.getUserAuthenticate(decodeToken.userId).subscribe(user => {});
        this.route.navigate([`teams/1`]);
      },
      (error: Error) => {
        console.log(error);
    });
  }

  onAuthenticateUser(user) {
    this.userService.authenticateUser(user)
      .subscribe( (tokenObject: Token) => {
        const decodeToken = this.userService.decodeTokenUser(tokenObject.userToken);
        localStorage.setItem('token','bearer ' + tokenObject.userToken);
        this.userService.getUserAuthenticate(decodeToken.userId).subscribe(user => {});
        this.route.navigate([`teams/1`]);
      },
      (error: Error) => {
        console.log(error);
    });
  }
}
