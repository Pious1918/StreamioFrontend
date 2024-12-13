import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVideoplayerComponent } from './report-videoplayer.component';

describe('ReportVideoplayerComponent', () => {
  let component: ReportVideoplayerComponent;
  let fixture: ComponentFixture<ReportVideoplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportVideoplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportVideoplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
