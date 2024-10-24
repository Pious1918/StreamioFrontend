import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from '../../store/user.selector';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-search-result',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SidepanelComponent,FormsModule],
  templateUrl: './user-search-result.component.html',
  styleUrl: './user-search-result.component.css'
})
export class UserSearchResultComponent implements OnInit  {
  searchQuery: string = '';
  users: any[] = [];
  loading: boolean = true;
 defaultProfilePic: any = './assets/avathar.jpg'
 user$!:Observable<any>

 userFollow:string[]=[]
  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient , 
    private _userService:UserService,
    private _store:Store
  ) {

    this.user$ = this._store.pipe(select(selectUser))
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query']; // Extract the search query from the URL
      this.fetchResults();
    });


    this.user$.subscribe((res) => {
      console.log("response from searchbar", res.userProfile.following);
      this.userFollow = [...res.userProfile.following]; // Create a new array
    });
    


    console.log("userer",this.userFollow)
  }
private userServiceUrl = 'http://localhost:5000/user-service'

  fetchResults() {

   
    this.http
      .get<any[]>(`http://localhost:5000/user-service/users?name=${this.searchQuery}`)
      .subscribe(
        (response) => {
          this.users = response;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching users', error);
          this.loading = false;
        }
      );
  }


  subscribeCh(userid: string) {
    console.log("Before subscribing, userFollow:", this.userFollow);
    this._userService.subscribeChannel(userid).subscribe((res) => {
      console.log(res);
      if (Array.isArray(this.userFollow)) {
        this.userFollow.push(userid); // Add the user ID to the following array
      } else {
        console.error("userFollow is not an array:", this.userFollow);
      }
    });
  }
  


  unsubscribe(userid: string) {
    this._userService.unsubscribeChannel(userid).subscribe((res) => {
      console.log(res);
      this.userFollow = this.userFollow.filter(id => id !== userid); // Filter without mutation
    });
  }
  

  
}