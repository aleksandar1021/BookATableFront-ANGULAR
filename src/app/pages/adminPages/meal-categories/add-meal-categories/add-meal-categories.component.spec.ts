import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMealCategoriesComponent } from './add-meal-categories.component';

describe('AddMealCategoriesComponent', () => {
  let component: AddMealCategoriesComponent;
  let fixture: ComponentFixture<AddMealCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMealCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMealCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
