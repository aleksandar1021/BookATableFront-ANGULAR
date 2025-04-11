import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantReservationsComponent } from './restaurant-reservations.component';

describe('RestaurantReservationsComponent', () => {
  let component: RestaurantReservationsComponent;
  let fixture: ComponentFixture<RestaurantReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantReservationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
