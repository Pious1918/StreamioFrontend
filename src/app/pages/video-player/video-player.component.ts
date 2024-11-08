import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js'; // Import video.js
import { VideoService } from '../../services/video.service';
import { CommentComponent } from '../comment/comment.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [HeaderComponent, CommentComponent, ReactiveFormsModule,FormsModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnDestroy{

  private _videoLink = "";
  private player: any;

  
  commentForm!: FormGroup;

 vvid!:string

  constructor(private _videoservice: VideoService, private _route: ActivatedRoute ,private fb: FormBuilder, private http: HttpClient) {
    // Listen to route changes to get the videoId
    this._route.params.subscribe(params => {
      const videoId = params['id'];
      console.log("Video ID:", videoId);
      this.vvid=videoId
      this.fetchVideo(videoId);
    });

    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(3)]]

    })
  }


  linkkk = '';

  // Fetch video data from the service
  private fetchVideo(videoId: string) {
    this._videoservice.getIndividualVideos(videoId).subscribe((res: any) => {
      console.log('Response:', res);
      console.log('Video link:', res.videolink);
      this.linkkk = res.videolink;
      this.videoLink = `https://d3qrczdrpptz8b.cloudfront.net/${this.linkkk}`;
      // this.videoLink = `https://d3qrczdrpptz8b.cloudfront.net/gyn/high/playlist_high.m3u8`;
    });
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

  // Initialize the video player
  private initializePlayer(): void {
    if (this.player) {
      console.log("Player already initialized.");
      return; // Prevent re-initialization
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

      // for accessing quality levels
      const qualityLevels = this.player.qualityLevels();
      qualityLevels.on('addqualitylevel', (event: any) => {
        const qualityLevel = event.qualityLevel;
        console.log('Quality level added:', qualityLevel);
      });

      // Error handling
      this.player.on('error', () => {
        console.error('Error loading video.');
      });
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }



   // Submit the comment
   submitComment(): void {
    if (this.commentForm.valid) {
      const commentData = { comment: this.commentForm.value.comment, videoId:this.vvid };

      
      this.postComment(commentData).subscribe(response => {
        console.log('Comment posted:', response);
        this.commentForm.reset(); 
      }, error => {
       
        console.error('Error posting comment:', error);
      });
    }
  }


  
    postComment(commentData: { comment: string ,videoId: string  }): Observable<any> {
      const apiUrl = 'http://localhost:5000/comment-service/comments'; 
      return this.http.post<any>(apiUrl, commentData);
    }

}
