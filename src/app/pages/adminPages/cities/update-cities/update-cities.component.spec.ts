import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCitiesComponent } from './update-cities.component';

describe('UpdateCitiesComponent', () => {
  let component: UpdateCitiesComponent;
  let fixture: ComponentFixture<UpdateCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
