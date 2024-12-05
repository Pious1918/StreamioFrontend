import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';


interface Banner {
  _id:string;
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-admin-banner-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-banner-list.component.html',
  styleUrl: './admin-banner-list.component.css'
})



export class AdminBannerListComponent implements OnInit {

  banners: Banner[]=[]

  constructor(private _userService: UserService) { }

  ngOnInit(): void {

    this.loadBanner()
  }



  loadBanner() {
    this._userService.getBanners().subscribe((res:any) => {
      console.log("response of ", res.getbanner._id)

      this.banners = res.getbanner
      console.log("babbere",this.banners)
    })
  }


  deleteBanner(bannerid: string, imageurl: string) {
    console.log("clicked on delete", bannerid, imageurl);
    
    // Use SweetAlert2 to ask for confirmation
    Swal.fire({
      title: 'Are you sure want to delete?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the deletion actions if confirmed
        this._userService.deleteBannerfromS3(imageurl).subscribe((res) => {
          console.log(res);
        });
  
        this._userService.deletebanner(bannerid).subscribe((res) => {
          console.log(res);
        });
  
        // Show success message (optional)
        Swal.fire(
          'Deleted!',
          'Your banner has been deleted.',
          'success'
        ).then(()=>{
          this.loadBanner()
        });
      }
    });
  }
  


}
