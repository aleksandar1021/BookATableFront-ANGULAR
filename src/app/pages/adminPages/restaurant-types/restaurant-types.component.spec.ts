import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantTypesComponent } from './restaurant-types.component';

describe('RestaurantTypesComponent', () => {
  let component: RestaurantTypesComponent;
  let fixture: ComponentFixture<RestaurantTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
