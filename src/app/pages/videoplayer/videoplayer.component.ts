import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import shaka from 'shaka-player';
import videojs from 'video.js';

import { VideoService } from '../../services/video.service';
import Hls from 'hls.js';
import { IvideoDocument } from '../user-home/home.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.css'
})
export class VideoplayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;

  private _videoLink = "";
  private player: any;
  constructor(private _videoservice: VideoService, private _route: ActivatedRoute) {

    this._route.params.subscribe(params => {
      const videoId = params['id']
      console.log("vvid", videoId)
      this.fetchVideo(videoId); // Fetch the video using the extracted ID

    })


  }

  private fetchVideo(videoId: string) {
    this._videoservice.getIndividualVideos(videoId).subscribe((res: any) => {
      console.log('response is', res);
      this.videoLink = 'https://d3qrczdrpptz8b.cloudfront.net/cnos/convertd.m3u8'; // Use the setter to update the video link
    });
  }


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

  ngAfterViewInit(): void {
    if (this._videoLink) {
      this.initializePlayer();
    }
  }

  private initializePlayer(): void {
    this.player = videojs(this.videoPlayer.nativeElement, {
      sources: [
        {
          src: this._videoLink,
          type: 'application/x-mpegURL'
        }
      ],
      controls: true,
      autoplay: true,
      preload: 'auto'
    });

    // Event listener to handle errors
    this.player.on('error', () => {
      console.error('Error loading video.');
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }


}
