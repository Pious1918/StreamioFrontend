import { Component, OnInit } from '@angular/core';
import { SidepanelComponent } from '../user-sidepanel/sidepanel.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectUser } from '../../../store/user.selector';
import { loadUserProfile } from '../../../store/user.action';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SidepanelComponent,CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  defaultProfilePic:any='./assets/avathar.jpg'
  user$!:Observable<any>
  userProfile: any;



  searchTerm: string = '';

  constructor(private _router:Router ,private _store:Store){

    this.user$ = this._store.pipe(select(selectUser))
  }

  ngOnInit(): void {
    this._store.dispatch(loadUserProfile());
    this.user$.subscribe((user:any)=>{
      console.log(user,"FROM SIDEBARRRRR");
      
      
      
      console.log("sub from side",user)
      if(user && user.updatedProfile) {
        this.userProfile = user.updatedProfile; // Store the user profile in the variable
      }else{
        this.userProfile = user.userProfile; // Store the user profile in the variable
      }
      // console.log("user is sideee",this.userProfile.profilepicture)

      // console.log(typeof user,user);

      if(user.profilePicUrl){
        this.userProfile = {...this.userProfile,profilepicture:user.profilePicUrl}
      }
      

    })
  }



  onSearch() {
    if (this.searchTerm.trim()) {
      this._router.navigate(['/results'], { queryParams: { query: this.searchTerm } });
    }
  }
}
