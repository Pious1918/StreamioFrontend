import { Component, ElementRef, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Picker } from 'emoji-picker-element';
import { IvideoDocument } from '../user-home/home.component';
import { HttpClient } from '@angular/common/http';
import videojs from 'video.js'; // Import video.js
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-report-videoplayer',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './report-videoplayer.component.html',
  styleUrl: './report-videoplayer.component.css'
})
export class ReportVideoplayerComponent {







  private _videoLink = "";
  private player: any;

  title!: string
  description!: string
  vvid!: string

  reportreason:any[]=[]
  channelName!: string
  subscribed!: string | boolean;

  constructor(private _videoservice: VideoService, private _route: ActivatedRoute, private http: HttpClient, private _router: Router) {

    // Listen to route changes to get the videoId
    this._route.params.subscribe(params => {
      const videoId = params['id'];
      console.log("Video ID:", videoId);
      this.vvid = videoId
      this.fetchVideo(videoId);
    });


  }

  linkkk = '';


  private fetchVideo(videoId: string) {

    this._videoservice.getIndividualVideos(videoId).subscribe((res: any) => {
      console.log('Response:', res);
      this.title = res._doc.title
      this.description = res._doc.description
      console.log('Video link:', res.videolink);
      this.linkkk = res._doc.videolink;
      this.channelName = res.uploader.name
      this.subscribed = res.subscribed
      this.videoLink = `https://d3qrczdrpptz8b.cloudfront.net/${this.linkkk}`;
    });

  }


  ngAfterViewInit(): void {

    this.fetchReportReason()
  
  }



  fetchReportReason(){
    this._videoservice.fetchVideoreportReason(this.vvid).subscribe((res:any)=>{
      console.log("fetched report reasons are",res)
      this.reportreason =res.reportreason[0]?.reasons
      
      console.log("reportreason",this.reportreason)
    })
  }


  // Set the video link and initialize the player
  set videoLink(value: string) {
    this._videoLink = value;
    if (this.player) {
      this.player.src({
        src: this._videoLink,
        type: 'application/x-mpegURL',
        withCredentials: true
      });
    } else if (this._videoLink) {
      this.initializePlayer();
    }
  }



  // Initializing  the video player
  private initializePlayer(): void {
    if (this.player) {
      console.log("Player already initialized.");
      return;
    }

    // Directly query the video element by its id
    const videoElement = document.getElementById('video-player') as HTMLVideoElement;
    if (videoElement) {
      this.player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        fluid: true,
        sources: [
          {
            src: this._videoLink,
            type: 'application/x-mpegURL'
          }
        ]
      });



      // Error handling
      this.player.on('error', () => {
        console.error('Error loading video.');
      });
    }
  }


  verifyVideo() {
    console.log(`Verifying video ${this.vvid}`);
  
    this._videoservice.verifyVideoByuser(this.vvid).subscribe(
      (res: any) => {
        console.log("response after verifying video", res);
  
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res?.data?.message || 'Video verified successfully!',
          confirmButtonText: 'OK'
        }).then(() => {
          this._router.navigate(['/userprofile']);
        });
      },
      (err: any) => {
        console.error("Error verifying video", err);
  
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Failed to verify the video. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  


}
