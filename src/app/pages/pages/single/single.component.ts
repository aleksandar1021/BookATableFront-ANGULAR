import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../interfaces/reservation.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { development } from '../../../../environments/development';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss']
})
export class SingleComponent implements OnInit, AfterViewChecked {
  minDate: string = '';
  maxDate: string = '';
  restaurant: any;
  id: string | null = null;
  timeSlots: string[] = [];
  numbersOfGuests: number[] = [];
  reservationForm: FormGroup;
  message: string = '';
  errorMessage: string = '';
  userId: number = 0;
  user: any;
  apiUrlRestaurants = "http://localhost:5000/restaurantPhotos/";
  apiUrlDishs = "http://localhost:5000/dishPhotos/";
  apiUrlUser = "http://localhost:5000/userPhotos/";

  isLoggedIn : boolean = false;

  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;  
  ratingMessage: string = ''; 
  errorMessageRating: string = '';
  messageRatingResponse: string = '';
  form: FormGroup;

  setRating(star: number): void {
    this.rating = star;
  }
  constructor(
    private restaurantService: RestaurantService,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.reservationForm = this.fb.group({
      date: ['', Validators.required],
      numberOfGuests: [null, Validators.required],
      time: [null, Validators.required],
      note: [''],
      userId: [null],
      restaurantId: [null]
    });
    this.form = new FormGroup({
      ratingMessage: new FormControl('')
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 20);
    this.maxDate = futureDate.toISOString().split('T')[0];
  
    this.id = this.route.snapshot.queryParamMap.get('id');
  
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.getRestaurant();
      this.restaurant = this.getRestaurant();
    });
  
    this.isLoggedIn = this.authService.isLoggedIn();
  
    if (this.isLoggedIn) {
      this.user = this.authService.getUserFromToken();
      this.userId = this.user.Id;
  
      this.reservationForm.patchValue({
        userId: this.userId,
        restaurantId: this.id
      });
    }
  }

  submitRating(): void {
    if (this.rating === 0) {
      this.errorMessageRating = 'Choose a rate.';
      return;
    }

    const ratingData = {
      rate: this.rating,
      message: this.form.get('ratingMessage')?.value || '',
      userId: this.userId,
      restaurantId: this.id
    };

    this.http.post(development.apiUrl + "Ratings", ratingData).subscribe({
      next: (response) => {
        this.messageRatingResponse = 'Review submitted successfully.';
        this.errorMessageRating = '';
        this.form.reset();
        this.rating = 0;
      },
      error: (error) => {
        this.errorMessageRating = 'An error has occured, please try again.';
        this.message = '';
        //console.error('Error:', error);
      }
    });
  }
  
  onSubmit(): void {
    console.log('Form Values before submission:', this.reservationForm.value);
  
    this.message = '';
    this.errorMessage = '';
  
    if (this.reservationForm.valid) {
      const reservation: Reservation = this.reservationForm.value;
  
      console.log('Submitting Reservation:', reservation);
  
      this.reservationService.makeReservation(reservation).subscribe({
        next: (response: any) => {
          this.message = 'Reservation successful, you will receive an email when the reservation is approved.';
        },
        error: (error) => {
          this.handleServerErrors(error);
        }
      });
    } else {
      this.message = 'Please fill out all required fields.';
    }
  }

  private handleServerErrors(error: any) {
    if (error.status === 422 && Array.isArray(error.error)) {
      this.clearErrors();

      error.error.forEach((err: { property: string, error: string }) => {
        const formControl = this.reservationForm.get(err.property.toLowerCase());
        if (formControl) {
          formControl.setErrors({
            serverError: err.error
          });
        }
      });
    } else {
      this.errorMessage = error.error.message;
    }
  }

  private clearErrors() {
    Object.keys(this.reservationForm.controls).forEach(key => {
      const control = this.reservationForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }

  generateTimeSlots(workFromHour: number, workFromMinute: number, workUntilHour: number, workUntilMinute: number, timeInterval: number): string[] {
    const slots: string[] = [];
    let startTime = workFromHour * 60 + workFromMinute;
    let endTime = workUntilHour * 60 + workUntilMinute;
    const lastValidTime = endTime - 60;

    while (startTime <= lastValidTime) {
      const hours = Math.floor(startTime / 60);
      const minutes = startTime % 60;
      const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}`;
      slots.push(formattedTime);
      startTime += timeInterval;
    }
    return slots;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  getRestaurant(): void {
    this.restaurantService.getRestaurant(this.id).subscribe(
      (response: any) => {
        this.restaurant = response;

        const workFromHour = this.restaurant.workFromHour;
        const workFromMinute = this.restaurant.workFromMinute;
        const workUntilHour = this.restaurant.workUntilHour;
        const workUntilMinute = this.restaurant.workUntilMinute;
        let timeInterval = this.restaurant.timeInterval;

        if (timeInterval < 10) {
          timeInterval = 10;
        }

        for (let i = 1; i <= this.restaurant.maxNumberOfGuests; i++) {
          this.numbersOfGuests.push(i);
        }

        this.timeSlots = this.generateTimeSlots(workFromHour, workFromMinute, workUntilHour, workUntilMinute, timeInterval);
      },
      (error) => {
        console.error('There was an error', error);
      }
    );
  }

  ngAfterViewChecked(): void {
    this.initializeCarousel();
    this.initializeCarousel1();
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
        }, 2500);
      }
    }

    autoPlay();

    this.renderer.listen(carousel, 'mousedown', dragStart);
    this.renderer.listen(carousel, 'mousemove', dragging);
    this.renderer.listen(document, 'mouseup', dragStop);
    this.renderer.listen(wrapper, 'mouseenter', () => clearTimeout(timeoutId));
    this.renderer.listen(wrapper, 'mouseleave', autoPlay);
  }


  private initializeCarousel1(): void {
    const carousel = this.el.nativeElement.querySelector(".carousel1") as HTMLElement;
    const wrapper = this.el.nativeElement.querySelector(".wrapper1") as HTMLElement;

    const firstCard = carousel.querySelector(".card1") as HTMLElement;
    const firstCardWidth = firstCard?.offsetWidth ?? 0;
    const arrowBtns = wrapper.querySelectorAll(".arrow") as NodeListOf<HTMLElement>;

    let isDragging = false;
    let startX: number, startScrollLeft: number;

    arrowBtns.forEach(btn => {
      this.renderer.listen(btn, 'click', () => {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        if (btn.id === "left1") {
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

    this.renderer.listen(carousel, 'mousedown', dragStart);
    this.renderer.listen(carousel, 'mousemove', dragging);
    this.renderer.listen(document, 'mouseup', dragStop);
    this.renderer.listen(wrapper, 'mouseenter', () => clearTimeout(0)); 
  }

}
