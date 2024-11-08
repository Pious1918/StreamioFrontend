import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidepanel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidepanel.component.html',
  styleUrl: './sidepanel.component.css'
})
export class SidepanelComponent {




  constructor(private _router:Router){

  }




  onLogout(){

    Swal.fire({
      title:'Are you sure want to Logout?',
      text:'You will be logged out!',
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay logged in'
    }).then((result)=>{

      if(result.isConfirmed){
        localStorage.removeItem('authtoken')
        localStorage.removeItem('userRefreshtoken')
        this._router.navigate(['/login'])
        Swal.fire(
          'Logged Out!',
          'You have successfully logged out.',
          'success'
        )
      }
    })



  
  }
}
