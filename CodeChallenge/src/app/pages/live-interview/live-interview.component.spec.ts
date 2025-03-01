import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInterviewComponent } from './live-interview.component';

describe('LiveInterviewComponent', () => {
  let component: LiveInterviewComponent;
  let fixture: ComponentFixture<LiveInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveInterviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
