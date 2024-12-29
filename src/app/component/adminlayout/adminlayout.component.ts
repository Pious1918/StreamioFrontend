import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [AdminHeaderComponent,RouterModule],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.css'
})
export class AdminlayoutComponent {

}
