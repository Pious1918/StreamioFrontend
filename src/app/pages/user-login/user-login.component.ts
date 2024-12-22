import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnDestroy {

  loginForm!: FormGroup
  registerForm!: FormGroup;
  isLoginActive: boolean = true;
  // data$ = interval(1000)
  datasubscribion!: Subscription;
  /**this is store all the subscription */
  private _subscription: Subscription = new Subscription()
  errorMessage!: string
  constructor(private _fb: FormBuilder, private _router: Router, private _userservice: UserService) {



    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })


    this.registerForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), this.strongPasswordValidator]],
      cpassword: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      country: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); // Attach custom validator here)



    // this.datasubscribion = this.data$.subscribe((data) => {
    //   console.log("data is", data)
    // })
  }


  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);
    const isValidLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

    return !passwordValid ? { weakPassword: true } : null;
  }


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cpassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  // Method to switch tabs
  toggleTab(isLogin: boolean) {
    this.isLoginActive = isLogin;
  }
  onSubmit() {

    if (this.loginForm.valid) {
      const userdata = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }

      console.log("userdata", userdata)
      this.errorMessage = ''; // Clear any previous error messages

      // const loginSub=this._userservice.loginUser(userdata).subscribe((res: any) => {
      //   console.log("Login successfully", res)

      //   localStorage.setItem('authtoken', res.token)
      //   localStorage.setItem('userRefreshtoken',res.userRefreshtoken)
      //   this._router.navigate(['/'])
      //   this.showsuccess()
      // })

      const loginSub = this._userservice.loginUser(userdata).subscribe({
        next: (res: any) => {
          if (res.success) {
            console.log("Login successfully", res);
            localStorage.setItem('authtoken', res.token);
            this._router.navigate(['/']);
            this.showsuccess(); // Display success message
          } else {
            this.errorMessage = res.message
          }
        },
        error: (err: any) => {
          console.error('Error during login:', err);
          this.errorMessage = err.error?.message || 'An unexpected error occurred';
        }
      })



      this._subscription.add(loginSub)
    }
  }

  showsuccess() {
    Swal.fire({
      title: 'Logged In Successfully',

      icon: 'success',
      toast: true,
      position: 'top-end', // Common toast position for a notification
      showConfirmButton: false, // Optional: No confirm button for toast
      timer: 3000 // Display for 3 seconds
    });
  }


  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
    }
  }


  existMessages: { email?: string; username?: string } = {};

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      console.log('Register Data:', this.registerForm.value);

      let userData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        cpassword: this.registerForm.value.cpassword,
        email: this.registerForm.value.email,
        mobile: this.registerForm.value.mobile,
        country: this.registerForm.value.country,
      }
      console.log('userData Data:', userData);


   const registerSub = this._userservice.registerUser(userData).subscribe((res: any) => {
      if (res.existmessages) {
        // Assign backend validation errors to `existMessages`
        this.existMessages = res.existmessages;
      } else {
        // Clear previous messages if successful
        this.existMessages = {};

        // Handle success
        console.log("New user added successfully", res);
        localStorage.setItem('authtoken', res.token);
        this._router.navigate(['/']);
        this.showsuccess();
      }
    });

      this._subscription.add(registerSub)
    }
  }


  ngOnDestroy(): void {
    // this.datasubscribion.unsubscribe()
    this._subscription.unsubscribe()
  }
}
