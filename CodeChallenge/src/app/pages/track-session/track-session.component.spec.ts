import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackSessionComponent } from './track-session.component';

describe('TrackSessionComponent', () => {
  let component: TrackSessionComponent;
  let fixture: ComponentFixture<TrackSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
