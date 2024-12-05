import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IvideoDocument } from '../user-home/home.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {


  count!: number
  activeCount!: number
  blockedCount!: number
  allvideos: IvideoDocument[] = [];

  constructor(private _adminservice: AdminService) { }

  ngOnInit(): void {
    this.fetchuserCount()

    this.topFiveVideos()
  }


  fetchuserCount() {

    this._adminservice.getAlluserCount().subscribe((res: any) => {
      console.log("res", res)
      this.count = res.totalUsers
      this.activeCount = res.activeUsers
      this.blockedCount = res.blockedUsers



    })
  }

  topFiveVideos(){
    this._adminservice.topfivevideos().subscribe((res:any)=>{
      console.log("top 5 video",res)
      this.allvideos=res.top
    })
  }


}
