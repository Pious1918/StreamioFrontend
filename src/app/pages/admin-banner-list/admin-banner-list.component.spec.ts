import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBannerListComponent } from './admin-banner-list.component';

describe('AdminBannerListComponent', () => {
  let component: AdminBannerListComponent;
  let fixture: ComponentFixture<AdminBannerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBannerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBannerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
