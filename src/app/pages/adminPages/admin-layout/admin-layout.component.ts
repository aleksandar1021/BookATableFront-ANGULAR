import { Component } from '@angular/core';
import { NavItem } from '../../../interfaces/navigation.interface';
import { AuthService } from '../../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SearchService } from '../../../services/shared.service';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  public filteredNavItems: NavItem[] = [];
  isLogged : boolean = false;
  showSearch: boolean = false;
  searchQuery: string = '';

  navItems: NavItem[] = [
    { name: 'Restaurants', route: '/admin/restaurants', useCaseId: 40, icon: 'fa fa-cutlery' },
    { name: 'Restaurant types', route: '/admin/restaurantTypes', useCaseId: 28, icon: 'fa fa-building-o' },
    { name: 'Cities', route: '/admin/cities', useCaseId: 18, icon: 'fa fa-location' },
    { name: 'Appendices', route: '/admin/appendices', useCaseId: 33, icon: 'fa fa-plus-circle' },
    { name: 'Meal categories', route: '/admin/mealCategories', useCaseId: 13, icon: 'fa fa-coffee' },
    { name: 'Contacts', route: '/admin/contacts', useCaseId: 13, icon: 'zmdi zmdi-email' },
    { name: 'Users', route: '/admin/users', useCaseId: 13, icon: 'fa fa-users' },

  ];

  constructor(private authService : AuthService, private router: Router, private searchService: SearchService){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadNavigation();
      this.authService.isLoggedIn().subscribe(isLogged => {
        this.isLogged = isLogged; 
      });
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSearch = (
          event.urlAfterRedirects.includes('/admin/restaurants') ||
          event.urlAfterRedirects.includes('/admin/users')
        );
      }
    });
    
  }


  logout(){
    this.authService.logout()
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.searchService.changeSearchQuery(input.value); 
    }
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
