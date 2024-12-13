import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiveService } from '../../services/live.service';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';

@Component({
  selector: 'app-live-list',
  standalone: true,
  imports: [HeaderComponent,CommonModule ,RouterModule , SidepanelComponent],
  templateUrl: './live-list.component.html',
  styleUrl: './live-list.component.css'
})
export class LiveListComponent {

  ongoingLives:any[] = [];

  constructor(private _liveservice:LiveService) {}

  ngOnInit(){


    this._liveservice.getOngoinglive().subscribe((res:any)=>{
      console.log("list of ongoing lives are ",res)

      this.ongoingLives=res.allLives
    })
  }



  trackByLiveId(index: number, live: any): string {
    return live._id;
}

}
