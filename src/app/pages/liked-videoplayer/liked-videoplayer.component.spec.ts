import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedVideoplayerComponent } from './liked-videoplayer.component';

describe('LikedVideoplayerComponent', () => {
  let component: LikedVideoplayerComponent;
  let fixture: ComponentFixture<LikedVideoplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedVideoplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedVideoplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
