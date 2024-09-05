import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NavItem } from '../../../interfaces/navigation.interface';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  isNavbarVisible = false;
  public filteredNavItems: NavItem[] = [];


  ngOnInit(): void {
    this.loadNavigation();
  }

  constructor(private authService : AuthService, private router: Router){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadNavigation();
    });
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

  navItems: NavItem[] = [
    { name: 'Home', route: '/home', useCaseId: 0 },
    { name: 'Reservations', route: '/reservations', useCaseId: 65 },
    { name: 'Saved', route: '/saved', useCaseId: 72 },
    { name: 'Search', route: '/search', useCaseId: 0 },
    { name: 'Contact', route: '/contact', useCaseId: 0 },
    
  ];

  loadNavigation(): void {
    this.filteredNavItems = [];
    const useCases = this.authService.getUseCases();
    this.navItems.forEach(element => {
      if(useCases.length){
        if(useCases.includes(element.useCaseId) || element.useCaseId == 0){
          this.filteredNavItems.push(element);
        }
      }
      else{
          if(element.useCaseId == 0){
            this.filteredNavItems.push(element);
          }
        }
      
    });
  }
 
  
  
  
}
