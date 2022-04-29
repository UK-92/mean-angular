import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  authSub: Subscription | any;

  constructor(public authService: AuthService) { }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatuListener().subscribe(status => {
      this.isLoading = false;
    });
  }

  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    let email = form.value.email;
    let password = form.value.password;
    this.authService.createUser(email, password);
  }
}
