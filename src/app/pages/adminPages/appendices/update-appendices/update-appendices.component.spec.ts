import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppendicesComponent } from './update-appendices.component';

describe('UpdateAppendicesComponent', () => {
  let component: UpdateAppendicesComponent;
  let fixture: ComponentFixture<UpdateAppendicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAppendicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAppendicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
