import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealCategoriesComponent } from './meal-categories.component';

describe('MealCategoriesComponent', () => {
  let component: MealCategoriesComponent;
  let fixture: ComponentFixture<MealCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MealCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
