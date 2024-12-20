import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../services/video.service';
import { RelativetimePipe } from '../../shared/pipes/relativetime.pipe';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

interface Movie {
  id: number;
  title: string;
  views: string;
  timeAgo: string;
  imageUrl: string;
}

interface banner{
  title:string,
  description:string,
  image:string
}
interface thumb{
  title:string,
  description:string,
  image:string
}

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum PaidStatus {
  PAID = "paid",
  UNPAID = "unpaid",
}
export interface IvideoDocument {
  _id: string,
  uploaderId: string,
  title: string,
  description: string,
  likes: number,
  views: number,
  report: number,
  createdAt: Date
  videolink: string,
  thumbnail?:string,
  category?:string,
  visibility: Visibility; // Updated to use the enum
  price: number,
  paid: PaidStatus; // Updated to use the enum
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule, RelativetimePipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  items:banner[] = [];


  thumbnails:banner[] = [];

  timerunning = 3000;
  timeAutonext = 7000;
  runAutorun: any;
  runTimeout: any;

  constructor(private router: Router, private _videoService: VideoService, private _http: HttpClient, private _userService:UserService) { }



  allvideos: any[] = [];


  ngOnInit(): void {
    // Start the auto run when the component loads
    this.runAutorun = setTimeout(() => {
      this.showSlider('next');
    }, this.timeAutonext);


    this.loadBanners()
    this.loadVideos(this.tab)
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








  goToVideoList() {
    this.router.navigate(['/videos']);
  }




 

  videolink: string[] = []; // Declare the videolink array

  loadVideos(tabvalue:string) {
    this._videoService.getAllVideos(tabvalue).subscribe((res: IvideoDocument[]) => {
      console.log("resss from lod video", res)
      this.allvideos = res;
      this.videolink = res.map(video => `https://d3qrczdrpptz8b.cloudfront.net/${video.videolink}`);  // Construct video link URL
      console.log("Video links:", this.videolink);    })
  }



  onMovieClick(movieId: string): void {

    console.log("id is ", movieId)
    this.router.navigate(['/video', movieId])



  }

  private _liveServiceUrl = 'https://streamiobackend.ddns.net/live-service'


  startLive() {

    const streamData = { title: 'my live', description: 'streaming alive' }
    this._http.post(`${this._liveServiceUrl}/livestart`, streamData)
      .subscribe(res => {
        console.log("live startedd", res)
      }, error => {
        console.error("error in live", error)
      })
  }


  loadBanners(){
    
    this._userService.getBanners().subscribe((res:any)=>{
      console.log("banner response is ",res)

      this.items=res.getbanner
      
      this.thumbnails=res.getbanner
    })
  }



  activeMenu: string | null = null;

toggleMenu(movieId: string, event: Event): void {
  if (this.activeMenu === movieId) {
    this.activeMenu = null; 
  } else {
    this.activeMenu = movieId; 
  }
}



saveToWatchLater(movieId: string): void {
  console.log('Saved to Watch Later:', movieId);

  this._videoService.updateSavewatchlater(movieId).subscribe(
    (res: any) => {
      console.log("response from watchlater", res);

      if (res.message === 'Video is already saved to Watch Later') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'This video is already in your Watch Later list.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else if (res.message === 'Video saved to Watch Later') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'The video has been successfully saved to your Watch Later list.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    },
    (error) => {
      console.error('Error:', error);
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        title: 'Failed to save the video. Please try again later.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  );

  this.activeMenu = null; // Close the menu after saving
}


tab='All'
tabs = ["All","Automobile", "Music", 'Sports', 'Entertainment', 'Education', 'Gaming', 'Lifestyle', 'Food' ,'DIY', 'Others', "Movies"];

onTabClick(tab: string): void {
  console.log('Selected Tab:', tab);

  this.tab=tab
  this.loadVideos(tab)
}

@ViewChild('tabsContainer', { static: true }) tabsContainer!: ElementRef;

scrollTabs(direction: 'left' | 'right') {
  const container = this.tabsContainer.nativeElement;
  const scrollAmount = 200; 
  direction === 'left' 
    ? (container.scrollLeft -= scrollAmount) 
    : (container.scrollLeft += scrollAmount);
}






}
