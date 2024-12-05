import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLikedPageComponent } from './user-liked-page.component';

describe('UserLikedPageComponent', () => {
  let component: UserLikedPageComponent;
  let fixture: ComponentFixture<UserLikedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLikedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLikedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
