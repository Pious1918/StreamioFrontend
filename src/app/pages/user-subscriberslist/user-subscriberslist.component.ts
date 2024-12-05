import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface sublist {
  _id: string,
  name: string,
  email: string
}
interface followingList {
  _id: string,
  name: string,
  email: string
}


@Component({
  selector: 'app-user-subscriberslist',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule],
  templateUrl: './user-subscriberslist.component.html',
  styleUrl: './user-subscriberslist.component.css'
})
export class UserSubscriberslistComponent implements OnInit {

  subscribers: sublist[] = []
  following :followingList[]=[]



  constructor(private _userService: UserService) { }


  ngOnInit(): void {

    this.fetchSubscribersList()
  }


  ngAfterViewInit(): void{

    this.fetchfollowingList()

  }


  fetchSubscribersList() {
    this._userService.getsubscribers().subscribe((res: any) => {
      console.log("res @ sub list", res)
      this.subscribers = res.data
    })
  }


  fetchfollowingList() {
    this._userService.getFollowingList().subscribe((res:any)=>{
      console.log('res @ afterviewinit',res)
      this.following=res.followingdata
    })
  }




  activeTab: 'subscribers' | 'following' = 'subscribers';



  toggleView(tab: 'subscribers' | 'following'): void {
    this.activeTab = tab;
  }


  unsubscribe(index: number, channelId:string): void {

    this._userService.unsubscribeChannel(channelId).subscribe((res:any)=>{
      console.log("@unsubscribe",res)
    })

    this.following.splice(index, 1); // Remove the user from the list
  }

}
