import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMoreClientComponent } from './read-more-client.component';

describe('ReadMoreClientComponent', () => {
  let component: ReadMoreClientComponent;
  let fixture: ComponentFixture<ReadMoreClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReadMoreClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadMoreClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
