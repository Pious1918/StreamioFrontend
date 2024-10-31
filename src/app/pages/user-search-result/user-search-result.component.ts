import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectUser } from '../../store/user.selector';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-user-search-result',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SidepanelComponent,FormsModule],
  templateUrl: './user-search-result.component.html',
  styleUrl: './user-search-result.component.css'
})
export class UserSearchResultComponent implements OnInit, OnDestroy  {
  searchQuery: string = '';
  users: any[] = [];
  loading: boolean = true;
 defaultProfilePic: any = './assets/avathar.jpg'
 user$!:Observable<any>

 userFollow:string[]=[]

 private _subscriptions: Subscription = new Subscription(); // Manage all subscriptions


  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient , 
    private _userService:UserService,
    private _store:Store,
    private _searchService:SearchService
  ) {

    this.user$ = this._store.pipe(select(selectUser))
  }

  ngOnInit() {

    this.searchQuery = this._userService.getCurrentSearchTerm()


    const queryParamSub = this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query']; // Extract the search query from the URL
      this.fetchResults();
    });
    this._subscriptions.add(queryParamSub);


    const userSub =this.user$.subscribe((res) => {
      console.log("response from searchbar", res.userProfile.following);
      this.userFollow = [...res.userProfile.following]; // Create a new array
    });
    
    this._subscriptions.add(userSub);


    console.log("userer",this.userFollow)
  }

  fetchResults() {
    const fetchSub = this._searchService.searchUsers(this.searchQuery).subscribe(
      (response) => {
        this.users = response;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching users', error);
        this.loading = false;
      }
    );
   

      this._subscriptions.add(fetchSub);
  }


  subscribeCh(userid: string) {
    console.log("Before subscribing, userFollow:", this.userFollow);
    const subscribeSub = this._userService.subscribeChannel(userid).subscribe((res) => {
      console.log(res);
      if (Array.isArray(this.userFollow)) {
        this.userFollow.push(userid); // Add the user ID to the following array
      } else {
        console.error("userFollow is not an array:", this.userFollow);
      }
    });

    this._subscriptions.add(subscribeSub);
  }
  


  unsubscribe(userid: string) {
    const unsubscribeSub = this._userService.unsubscribeChannel(userid).subscribe((res) => {
      console.log(res);
      this.userFollow = this.userFollow.filter(id => id !== userid); // Filter without mutation
    });
    this._subscriptions.add(unsubscribeSub);
  }
  

  ngOnDestroy() {
    // Unsubscribe from all active subscriptions
    this._subscriptions.unsubscribe();
  }
}