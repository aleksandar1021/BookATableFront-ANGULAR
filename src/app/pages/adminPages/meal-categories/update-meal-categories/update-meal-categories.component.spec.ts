import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMealCategoriesComponent } from './update-meal-categories.component';

describe('UpdateMealCategoriesComponent', () => {
  let component: UpdateMealCategoriesComponent;
  let fixture: ComponentFixture<UpdateMealCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateMealCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMealCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
