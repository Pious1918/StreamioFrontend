import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivatevideosComponent } from './user-privatevideos.component';

describe('UserPrivatevideosComponent', () => {
  let component: UserPrivatevideosComponent;
  let fixture: ComponentFixture<UserPrivatevideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPrivatevideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPrivatevideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
