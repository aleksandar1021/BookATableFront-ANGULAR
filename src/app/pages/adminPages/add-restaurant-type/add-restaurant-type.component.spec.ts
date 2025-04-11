import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRestaurantTypeComponent } from './add-restaurant-type.component';

describe('AddRestaurantTypeComponent', () => {
  let component: AddRestaurantTypeComponent;
  let fixture: ComponentFixture<AddRestaurantTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRestaurantTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRestaurantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
