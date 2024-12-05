import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-liked-page',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, FormsModule, CommonModule,RouterModule],
  templateUrl: './user-liked-page.component.html',
  styleUrl: './user-liked-page.component.css'
})
export class UserLikedPageComponent implements OnInit{


  constructor(private _videoservice:VideoService , private _router: Router){}


  likedVideos :any[]= [];


  ngOnInit(): void {
  
    this.fetchLikedVideos()
  }


  fetchLikedVideos(){
    this._videoservice.getlikedvideos().subscribe((res:any)=>{
      console.log("liked videos are ",res)
      this.likedVideos=res.videos
    })
  }

  onMovieClick(videoid:string){

    console.log("video id on clickin",videoid)
    this._router.navigate(['/likedvideo', videoid])

  }

}
