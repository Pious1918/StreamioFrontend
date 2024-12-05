import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.css'
})
export class OtpPageComponent implements OnInit {

  otpForm!: FormGroup;
  otpGenerated = false;
  loading = false; // Add a loading state

  timer: any = 60; // 1 minutes in seconds
  timerSubscription!: Subscription; // Subscription to manage the timer
  showResendButton = false;
  resettingEmail = ''

  responsemsg: string = ''

  constructor(private _userService: UserService, private _fb: FormBuilder, private _router: Router) {
    this.otpForm = this._fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

  }




  ngOnInit(): void {
    this.resettingEmail = this._userService.getEmail()

    console.log("email is", this.resettingEmail)

    const emailfromstate = history.state.email
    console.log("emailform", emailfromstate)
    this.startTimer(); // Start the timer when the page initializes

  }



  onOtpSubmit() {
    if (this.otpForm.valid) {
      const otpValue = Object.values(this.otpForm.value).join('');

      console.log('Entered OTP:', typeof otpValue);
      this._userService.submitOtp(otpValue, this.resettingEmail).subscribe((res: any) => {
        console.log("response after submitt", res)
        if (res.message == 'success') {
          console.log("hwer insidemessage")
          this._router.navigate(['/newpass'], { state: { email: res.checkVAlidOtp.email } })
        } else {
          this.responsemsg = res.message
        }
      })
      // Perform OTP verification logic here

    }
  }





  startTimer() {
    console.log("Timer starts");
    this.showResendButton = false;
    this.timer = 60; // Set timer to 3 minutes (180 seconds)
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.stopTimer();
        this.showResendButton = true; // Show resend button after timer expires
      }
    });
  }
  

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


  // Call this function to resend OTP
  resendOtp() {

    this._userService.generateOtp(this.resettingEmail).subscribe((res)=>{
      console.log("new otp",res)
    })
  }



  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
  

}
