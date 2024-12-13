import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportVideoComponent } from './admin-report-video.component';

describe('AdminReportVideoComponent', () => {
  let component: AdminReportVideoComponent;
  let fixture: ComponentFixture<AdminReportVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReportVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
