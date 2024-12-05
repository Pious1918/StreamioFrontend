import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';


export interface CheckValidOtp {
  _id: string;
  email: string;
  otp: string;
  expiresAt: string;  // ISO 8601 format date string
  __v: number;
}

export interface OtpResponse {
  checkVAlidOtp: CheckValidOtp;
  message: string;
}


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {

  resetForm!: FormGroup
  otpForm!: FormGroup;
  otpGenerated = false;
  loading = false; // Add a loading state



  constructor(private _userService: UserService, private _fb: FormBuilder, private _router: Router) {
    
    this.resetForm = this._fb.group({
      email: ['', Validators.required]
    })

  }

  resettingEmail = ''

  responseMessage: string = ''; // Holds the response message

  onSubmit() {

    if (this.resetForm.valid) {
      this.loading = true; // Set loading state to true

      const email = this.resetForm.value.email
      this.resettingEmail = this.resetForm.value.email
      console.log("email", email)
      this._userService.generateOtp(email).subscribe((res: any) => {
        console.log("response form here", res)

        if (res.message == 'no such email exists') {
          this.responseMessage = res.message;
        }
        else {

          this._userService.setEmail(email)
          this._router.navigate(['/otp'])
        }

      })
    }

  }






}
