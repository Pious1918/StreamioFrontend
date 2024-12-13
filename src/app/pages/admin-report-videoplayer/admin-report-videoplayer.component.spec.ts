import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportVideoplayerComponent } from './admin-report-videoplayer.component';

describe('AdminReportVideoplayerComponent', () => {
  let component: AdminReportVideoplayerComponent;
  let fixture: ComponentFixture<AdminReportVideoplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportVideoplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportVideoplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
