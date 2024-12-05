import { Component } from '@angular/core';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-user-privatevideos',
  standalone: true,
  imports: [UserProfileComponent],
  templateUrl: './user-privatevideos.component.html',
  styleUrl: './user-privatevideos.component.css'
})
export class UserPrivatevideosComponent {

}
