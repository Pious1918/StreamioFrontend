import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit{
  errorMessage: string = 'Unknown error';


  constructor(private _route:ActivatedRoute , private _authservice:AuthService){}

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.errorMessage = params['message'] || this.errorMessage;
      if(this.errorMessage=='User is blocked'){
        console.log("yay its the message")
        this._authservice.logout()
      }
    });
  }
}
