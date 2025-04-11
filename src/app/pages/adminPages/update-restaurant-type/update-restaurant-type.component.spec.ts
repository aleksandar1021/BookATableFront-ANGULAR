import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRestaurantTypeComponent } from './update-restaurant-type.component';

describe('UpdateRestaurantTypeComponent', () => {
  let component: UpdateRestaurantTypeComponent;
  let fixture: ComponentFixture<UpdateRestaurantTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateRestaurantTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRestaurantTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
