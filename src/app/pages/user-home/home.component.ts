import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../services/video.service';
import { RelativetimePipe } from '../../shared/pipes/relativetime.pipe';

interface Movie {
  id: number;
  title: string;
  views: string;
  timeAgo: string;
  imageUrl: string;
}

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum PaidStatus {
  PAID = "paid",
  UNPAID = "unpaid",
}
export interface IvideoDocument{
  _id:string,
  uploaderId:string,
  title:string,
  description:string,
  likes:number,
  views:number,
  createdAt:Date
  videolink:string,
  visibility: Visibility; // Updated to use the enum
  price:number,
  paid: PaidStatus; // Updated to use the enum
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule ,RelativetimePipe, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  items = [
    { img: 'assets/thumb.jpg', author: 'N S Pious', title: 'New title', topics: 'Video streaming', des: 'Lorem ipsum...' },
    { img: 'assets/top3.jpg', author: 'N S Pious', title: 'New title', topics: 'Video streaming', des: 'Lorem ipsum...' },
    { img: 'assets/clark.jpg', author: 'N S Pious', title: 'New title', topics: 'Video streaming', des: 'Lorem ipsum...' }
  ];

  thumbnails = [
    { img: 'assets/thumb.jpg', title: 'New Slider', des: 'Description' },
    { img: 'assets/top3.jpg', title: 'New Slider', des: 'Description' },
    { img: 'assets/clark.jpg', title: 'New Slider', des: 'Description' }
  ];

  timerunning = 3000;
  timeAutonext = 7000;
  runAutorun: any;
  runTimeout: any;
  constructor(private router: Router , private _videoService:VideoService) {}



  allvideos:IvideoDocument[]=[];


  ngOnInit(): void {
    // Start the auto run when the component loads
    this.runAutorun = setTimeout(() => {
      this.showSlider('next');
    }, this.timeAutonext);


  this.loadVideos()
  }

  ngOnDestroy(): void {
    // Clear all timeouts when the component is destroyed to prevent memory leaks
    clearTimeout(this.runAutorun);
    clearTimeout(this.runTimeout);
  }

  showSlider(type: string): void {
    const itemslider = document.querySelectorAll('.carousel .list .item');
    const itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item');
    const carouselDom = document.querySelector('.carousel');

    if (type === 'next') {
      if (itemslider.length && itemThumbnail.length) {
        (document.querySelector('.carousel .list') as HTMLElement)?.appendChild(itemslider[0]);
        (document.querySelector('.carousel .thumbnail') as HTMLElement)?.appendChild(itemThumbnail[0]);
        carouselDom?.classList.add('next');
      }
    } else {
      const positionLastItem = itemslider.length - 1;
      if (itemslider.length && itemThumbnail.length) {
        (document.querySelector('.carousel .list') as HTMLElement)?.prepend(itemslider[positionLastItem]);
        (document.querySelector('.carousel .thumbnail') as HTMLElement)?.prepend(itemThumbnail[positionLastItem]);
        carouselDom?.classList.add('prev');
      }
    }

    clearTimeout(this.runTimeout);
    this.runTimeout = setTimeout(() => {
      carouselDom?.classList.remove('next');
      carouselDom?.classList.remove('prev');
    }, this.timerunning);

    clearTimeout(this.runAutorun);
    this.runAutorun = setTimeout(() => {
      this.showSlider('next');
    }, this.timeAutonext);
  }

  onSeeMore(item: any): void {
    console.log(item);
    // Handle the "See More" click event
  }






  videos = [
    { title: 'Video 1', description: 'Description 1', source: 'https://streamiovideoupload.s3.eu-north-1.amazonaws.com/video1.mp4' },
    { title: 'Video 2', description: 'Description 2', source: 'https://streamiovideoupload.s3.eu-north-1.amazonaws.com/3116737-hd_1920_1080_25fps.mp4' },
    { title: 'Video 3', description: 'Description 3', source: 'https://streamiovideoupload.s3.eu-north-1.amazonaws.com/3116737-hd_1920_1080_25fps.mp4' },
    // Add more video objects as needed
  ];
  
  goToVideoList() {
    this.router.navigate(['/videos']);
  }




  movies: Movie[] = [
    {
      id: 1,
      title: 'The Movie|HD Film',
      views: '2.5k',
      timeAgo: '2 days ago',
      imageUrl: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: 2,
      title: 'The Movie|HD Film',
      views: '2.5k',
      timeAgo: '2 days ago',
      imageUrl: 'https://picsum.photos/400/300?random=2'
    },
    {
      id: 3,
      title: 'The Movie|HD Film',
      views: '2.5k',
      timeAgo: '2 days ago',
      imageUrl: 'https://picsum.photos/400/300?random=3'
    },
    {
      id: 4,
      title: 'The Movie|HD Film',
      views: '2.5k',
      timeAgo: '2 days ago',
      imageUrl: 'https://picsum.photos/400/300?random=4'
    }
  ];



  loadVideos(){
    this._videoService.getAllVideos().subscribe((res:IvideoDocument[] )=>{
      console.log("resss from lod video",res)
      this.allvideos = res; 
    })
  }



  onMovieClick(movieId: string): void {

    console.log("id is ",movieId)
     this.router.navigate(['/video',movieId])



  }
}
