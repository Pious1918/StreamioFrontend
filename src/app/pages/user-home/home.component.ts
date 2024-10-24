import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  items = [
    { img: 'assets/thumbnail.jpg', author: 'N S Pious', title: 'New title', topics: 'Video streaming', des: 'Lorem ipsum...' },
    { img: 'assets/thumbnail4.jpg', author: 'N S Pious', title: 'New title', topics: 'Video streaming', des: 'Lorem ipsum...' },
    { img: 'assets/thumbnail1.webp', author: 'N S Pious', title: 'New title', topics: 'Video streaming', des: 'Lorem ipsum...' }
  ];

  thumbnails = [
    { img: 'assets/thumbnail.jpg', title: 'New Slider', des: 'Description' },
    { img: 'assets/thumbnail4.jpg', title: 'New Slider', des: 'Description' },
    { img: 'assets/thumbnail1.webp', title: 'New Slider', des: 'Description' }
  ];

  timerunning = 3000;
  timeAutonext = 7000;
  runAutorun: any;
  runTimeout: any;

  ngOnInit(): void {
    // Start the auto run when the component loads
    this.runAutorun = setTimeout(() => {
      this.showSlider('next');
    }, this.timeAutonext);
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
}
