import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../services/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-report-video',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-report-video.component.html',
  styleUrl: './admin-report-video.component.css'
})
export class AdminReportVideoComponent implements OnInit{


  reportVideos:any[]=[]

  constructor(private _videoservice:VideoService , private _router: Router){}


  ngOnInit(): void {
    this.fetchReportVideo()
  }


  fetchReportVideo(){
    this._videoservice.fetchReportAdmin().subscribe((res:any)=>{
      console.log("report video",res)
      this.reportVideos=res.videos
    })
  }


  onReportvideoClick(videoId:string){
    console.log("video id ",videoId)
    this._router.navigate(['admin/adminvideoplayer', videoId])

  }
}
