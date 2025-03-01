import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChallengeComponent } from './live-challenge.component';

describe('LiveChallengeComponent', () => {
  let component: LiveChallengeComponent;
  let fixture: ComponentFixture<LiveChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
