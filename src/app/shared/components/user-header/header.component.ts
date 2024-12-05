import { Component, OnInit } from '@angular/core';
import { SidepanelComponent } from '../user-sidepanel/sidepanel.component';
import { debounceTime, distinctUntilChanged, Observable, Subject, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectUser } from '../../../store/user.selector';
import { loadUserProfile } from '../../../store/user.action';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  defaultProfilePic: any = './assets/avathar.jpg'
  user$!: Observable<any>
  userProfile: any;



  searchTerm: string = '';
  searchTermSubject = new Subject<string>()
  searchSubscription: Subscription = new Subscription()

  constructor(private _router: Router, private _store: Store, private _userService: UserService) {

    this.user$ = this._store.pipe(select(selectUser))
  }

  ngOnInit(): void {
    this._store.dispatch(loadUserProfile());
    this.user$.subscribe((user: any) => {
      console.log(user, "FROM SIDEBARRRRR");



      console.log("sub from side", user)
      if (user && user.updatedProfile) {
        this.userProfile = user.updatedProfile; // Store the user profile in the variable
      } else {
        this.userProfile = user.userProfile; // Store the user profile in the variable
      }
      // console.log("user is sideee",this.userProfile.profilepicture)

      // console.log(typeof user,user);

      if (user.profilePicUrl) {
        this.userProfile = { ...this.userProfile, profilepicture: user.profilePicUrl }
      }


    })

    this.searchTerm = this._userService.getCurrentSearchTerm()

    this.searchSubscription = this.searchTermSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        return this._router.navigate(['/results'], { queryParams: { query: this.searchTerm } })
      })
    ).subscribe()

  }



  onSearchTermChange(term: string) {
    this.searchTerm = term
    this._userService.updateSearchTerm(term)
    this.searchTermSubject.next(term)
  }


  onSearch() {
    if (this.searchTerm.trim()) {
      this._router.navigate(['/results'], { queryParams: { query: this.searchTerm } });
    }
  }


  clearSearch() {
    this.searchTerm = '';
    this._userService.updateSearchTerm('')

  }


}
