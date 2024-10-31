import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as shaka from 'shaka-player';
import { VideoService } from '../../services/video.service';
import Hls from 'hls.js';
import { IvideoDocument } from '../user-home/home.component';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.css'
})
export class VideoplayerComponent implements OnInit {


  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  videoId!: string;

  constructor(private route: ActivatedRoute, private _videoService: VideoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = params.get('id')!;
      console.log(this.videoId)

    })
    this.initPlayer(this.videoId);


    // const video = this.videoElement.nativeElement;
    // const videoSrc = 'http://localhost:5002/hls/hls-672094acd5c83c1bd1adbd86/index.m3u8';

    // // Check if the browser can play HLS natively
    // if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //   video.src = videoSrc;
    //   console.log("jjpoff")
    // } else if (Hls.isSupported()) {
    //   const hls = new Hls();
    //   hls.loadSource(videoSrc);
    //   hls.attachMedia(video);
    //   console.log("jjpoff")

    // } else {
    //   console.error('This browser does not support HLS playback.');
    // }

  }

  videoLink: string = ''

  ngAfterViewInit() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    // Set the initial volume (0 to 1 scale)
    video.volume = 0.01; // Set to 20% volume, adjust as needed

    // Optionally mute the video initially
  }
  videoDetails: IvideoDocument | null = null; // Holds the video details

  async initPlayer(videoid: string) {
    console.log("vvdidd", videoid)
    this._videoService.getIndividualVideos(videoid).subscribe((res: any) => {
      console.log("res is ", res)
      this.videoLink = res
      console.log("streaming video fron", this.videoLink)

      this.videoDetails = res; // Save response in the object





    })


    // console.log("linkkk",this.videoLink)
    // const video = this.videoElement.nativeElement
    // const player = new shaka.Player(video)

    // Configure error handling

    // Set up the video URL, pointing to the HLS playlist (.m3u8) file on the backend
    // const hlsUrl = `http://localhost:5000/video-service/hls-${this.videoId}/index.m3u8`;

    // try {
    //   await player.load(hlsUrl);  // Load the HLS stream
    //   console.log("The video has been loaded successfully.");
    // } catch (error) {
    //   console.error("Error loading the video:", error);
    // }

  }



}
