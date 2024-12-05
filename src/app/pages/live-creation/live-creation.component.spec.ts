import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCreationComponent } from './live-creation.component';

describe('LiveCreationComponent', () => {
  let component: LiveCreationComponent;
  let fixture: ComponentFixture<LiveCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
