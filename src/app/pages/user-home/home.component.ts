import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


}
