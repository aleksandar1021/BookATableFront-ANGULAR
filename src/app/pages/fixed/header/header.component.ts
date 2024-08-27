import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isNavbarVisible = false;
  constructor(private authService : AuthService){

  }

  toggleNavbar() {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  logout(){
    this.authService.logout();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }
  
}
