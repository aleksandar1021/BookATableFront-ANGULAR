import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MealCategoryService } from '../../../services/mealCategory.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Saved } from '../../../interfaces/saved.interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] 
})
export class HomeComponent implements OnInit, AfterViewChecked{

  isVisible : boolean = false;
  isLogged : boolean = false;
  apiUrlMealCategories : string = "http://localhost:5000/mealCategories/"
  apiUrlRestaurants : string = "http://localhost:5000/restaurantPhotos/"

  mealCategories: any[] = []; 
  restaurants: any[] = []; 
  trendyRestaurants: any[] = []; 
  newestRestaurants: any[] = []; 
  searchControl = new FormControl('');
  searchResults$: Observable<any[]> = of([]);


  constructor(private mealCategoryService: MealCategoryService, 
              private renderer: Renderer2, 
              private el: ElementRef, 
              private restaurantService: RestaurantService,
              private authService: AuthService,
              private titleService: Title
            ) { 
              this.titleService.setTitle('Book a table | Home');
            }

  
  


  ngOnInit(): void {
    this.getMealCategories();
    this.getRestaurants();
    this.getTrendyRestaurants();
    this.getNewestRestaurants();
    this.authService.isLoggedIn().subscribe(isLogged => {
      this.isLogged = isLogged; 
    });

    this.searchResults$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => {
        const query = value ?? '';
        if (query.length === 0) {
          return of([]); 
        }
        return this.restaurantService.searchRestaurants(query).pipe(
          map(response => response.data || [])
        );
      })
    );
  }

  ngAfterViewChecked(): void {
    this.initializeCarousel();
  }


  toggleSave(restaurant: any) {
    const userId = this.authService.getUserFromToken().Id;
    const isSaved = !restaurant.isSaved;
  
    const savedData: Saved = {
      userId: userId,
      restaurantId: restaurant.id
    };
  
    this.restaurantService.toggleSaveRestaurant(savedData).subscribe(
      response => {
        restaurant.isSaved = isSaved;
      },
      error => {
        console.error('Error saving restaurant:', error);
      }
    );
  }

  

  getMealCategories(): void {
    this.mealCategoryService.getMealCategories().subscribe(
      (response: any) => {  
        this.mealCategories = response.data;
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe(
      (response: any) => {  
        this.restaurants = response.data;  
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  getTrendyRestaurants(): void {
    this.restaurantService.getTrendyRestaurants().subscribe(
        (response: any) => {
            this.trendyRestaurants = response.data; 
        },
        (error) => {
            console.error('There was an error', error);
        }
    );
  }
  getNewestRestaurants(): void {
    this.restaurantService.getNewestRestaurants().subscribe(
      (response: any) => {
        this.newestRestaurants = response.data;
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }
  


  show() : void {
    this.isVisible = !this.isVisible;
  }

  private initializeCarousel(): void {
    const carousel = this.el.nativeElement.querySelector(".carousel") as HTMLElement;
    const wrapper = this.el.nativeElement.querySelector(".wrapper") as HTMLElement;
    if (!carousel || !wrapper) {
      console.error("Element with class 'carousel' or 'wrapper' not found.");
      return;
    }

    const firstCard = carousel.querySelector(".card") as HTMLElement;
    const firstCardWidth = firstCard?.offsetWidth ?? 0;
    const arrowBtns = wrapper.querySelectorAll("i") as NodeListOf<HTMLElement>;

    let isDragging = false;
    let startX: number, startScrollLeft: number;
    let timeoutId: number;

    arrowBtns.forEach(btn => {
      this.renderer.listen(btn, 'click', () => {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        if (btn.id === "left") {
          carousel.scrollLeft = Math.max(carousel.scrollLeft - firstCardWidth, 0);
        } else {
          carousel.scrollLeft = Math.min(carousel.scrollLeft + firstCardWidth, maxScrollLeft);
        }
      });
    });

    const dragStart = (e: MouseEvent) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    }

    const dragging = (e: MouseEvent) => {
      if (!isDragging) return;
      carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }

    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    }

    const autoPlay = () => {
      if (window.innerWidth < 800) return;
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft < maxScrollLeft) {
        timeoutId = window.setTimeout(() => {
          carousel.scrollLeft = Math.min(carousel.scrollLeft + firstCardWidth, maxScrollLeft);
        }, 5000);
      }
    }

    autoPlay();

    this.renderer.listen(carousel, 'mousedown', dragStart);
    this.renderer.listen(carousel, 'mousemove', dragging);
    this.renderer.listen(document, 'mouseup', dragStop);
    this.renderer.listen(wrapper, 'mouseenter', () => clearTimeout(timeoutId));
    this.renderer.listen(wrapper, 'mouseleave', autoPlay);
  }
}
