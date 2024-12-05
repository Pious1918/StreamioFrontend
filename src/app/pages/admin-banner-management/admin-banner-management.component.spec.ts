import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBannerManagementComponent } from './admin-banner-management.component';

describe('AdminBannerManagementComponent', () => {
  let component: AdminBannerManagementComponent;
  let fixture: ComponentFixture<AdminBannerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBannerManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBannerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
