import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchResultComponent } from './user-search-result.component';

describe('UserSearchResultComponent', () => {
  let component: UserSearchResultComponent;
  let fixture: ComponentFixture<UserSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
