import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {

  constructor(private _router:Router){}

  isNavbarOpen = false; // Initialize the navbar state

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen; // Toggle the state
  }


  onLogout(){



    Swal.fire({
      title:'Are you sure?',
      text:'You will be logged out!',
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay logged in'
    }).then((result)=>{

      if(result.isConfirmed){
        localStorage.removeItem('admintoken')
        this._router.navigate(['/adminlogin'])
        Swal.fire(
          'Logged Out!',
          'You have successfully logged out.',
          'success'
        )
      }
    })
    
  }


 
}
