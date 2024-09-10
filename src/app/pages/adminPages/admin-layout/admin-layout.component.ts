import { Component } from '@angular/core';
import { NavItem } from '../../../interfaces/navigation.interface';
import { AuthService } from '../../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  public filteredNavItems: NavItem[] = [];
  isLogged : boolean = false;


  navItems: NavItem[] = [
    { name: 'Restaurants', route: '/admin/restaurants', useCaseId: 40, icon: ' fa-cutlery' },
    { name: 'Restaurant types', route: '/admin/restaurantTypes', useCaseId: 28, icon: '  fa-building-o' },
    { name: 'Cities', route: '/admin/cities', useCaseId: 18, icon: '  fa-location' },

  ];

  constructor(private authService : AuthService, private router: Router){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadNavigation();
      this.authService.isLoggedIn().subscribe(isLogged => {
        this.isLogged = isLogged; 
      });
    });

    
  }

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
