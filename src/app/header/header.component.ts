import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription | any;
  isUserAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }


  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isLoggedIn();
    this.authListenerSubs = this.authService.getAuthStatuListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated
    });
  }

  logOut(){
    this.authService.logOut();
  }

}
