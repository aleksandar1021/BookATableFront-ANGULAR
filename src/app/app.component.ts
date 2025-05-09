import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showHeaderFooter: boolean = true;

  constructor(private router: Router) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.showHeaderFooter = !(
            event.urlAfterRedirects.includes('/admin')
          );
        }
      });  
    }


  title = 'BookATableAngular';
}


