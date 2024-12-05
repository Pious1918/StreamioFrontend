import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  newPasswordform!: FormGroup
  email: string = '';  // To store the passed email

  constructor(private route: ActivatedRoute, private _fb: FormBuilder, private _userService: UserService, private _router: Router) {

    this.newPasswordform = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.strongPasswordValidator]]
    })

    const emailfromstate = history.state.email
    if (emailfromstate) {
      this.email = emailfromstate
      console.log("email passed to the reset page", this.email)
    }
  }



  onSubmit() {

    if (this.newPasswordform.valid) {
      console.log("pasword is", this.newPasswordform.value.password)

      const newPass = this.newPasswordform.value.password
      this._userService.resetPassword(newPass, this.email).subscribe((res) => {
        console.log("response id ", res)
        this._router.navigate(['/login'])
        this.showsuccess()

      })
    }
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


  showsuccess() {
    Swal.fire({
      title: 'Password changed Successfully',

      icon: 'success',
      toast: true,
      position: 'top-end', // Common toast position for a notification
      showConfirmButton: false, // Optional: No confirm button for toast
      timer: 3000 // Display for 3 seconds
    });
  }
}
