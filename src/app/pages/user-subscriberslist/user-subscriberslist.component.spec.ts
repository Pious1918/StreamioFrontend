import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubscriberslistComponent } from './user-subscriberslist.component';

describe('UserSubscriberslistComponent', () => {
  let component: UserSubscriberslistComponent;
  let fixture: ComponentFixture<UserSubscriberslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubscriberslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSubscriberslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
