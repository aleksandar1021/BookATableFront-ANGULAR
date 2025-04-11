import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppendicesComponent } from './add-appendices.component';

describe('AddAppendicesComponent', () => {
  let component: AddAppendicesComponent;
  let fixture: ComponentFixture<AddAppendicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAppendicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppendicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
