import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm!:FormGroup

  constructor(private _fb:FormBuilder , private _router:Router , private _adminservice:AdminService){

    this.loginForm = this._fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }


  onSubmit(){
   
    if(this.loginForm.valid){
      const adminData={
        email:this.loginForm.value.email,
        password:this.loginForm.value.password
      }

      console.log(adminData)
      this._adminservice.loginAdmin(adminData).subscribe((res:any)=>{
        console.log("admin Login successfully",res)
        localStorage.setItem('admintoken',res.token)
        this._router.navigate(['/userlist'])
      })
    }
  }
}
