import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';



export interface User {
  _id: string;
  name: string;
  email: string;
  phonenumber?: string;
  country?: string;
  profilepicture?: string;
  updatedProfile?: User;
  status?: UserStatus;
  profilePicUrl?: string;
}

export enum UserStatus {
  Active = 'active',
  Blocked = 'blocked'
}

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [AdminHeaderComponent, CommonModule, FormsModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent implements OnInit {

  defaultProfilePic: string = './assets/avathar.jpg'


  userList: any[] = []

  // Pagination variables
  paginatedUserList: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number[] = [];
  pageSizes: number[] = [10, 15, 20];

  private _subscription: Subscription = new Subscription(); // To track all subscriptions

  constructor(private _adminservice: AdminService) { }

  ngOnInit(): void {
    this.loadAdmin();
  }


  loadAdmin() {
    const adminSub = this._adminservice.loadAdmindash().subscribe((res: any) => {
      console.log(res.users)
      this.userList = res.users

    })

    this._subscription.add(adminSub); // Add to subscription tracker

  }






  toggleUserStatus(user: User): void {

    const newStatus = user.status === UserStatus.Active ? UserStatus.Blocked : UserStatus.Active;
    const userId = user._id;
    this.confirm(newStatus, userId, user);
  }



  confirm(newStatus: UserStatus, userId: string, user: User): void {
    Swal.fire({
      title: `Do you want to ${newStatus === UserStatus.Blocked ? 'block' : 'unblock'} the user?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {

        const statusSub = this._adminservice.changeStatus(newStatus, userId).subscribe(
          (res: any) => {

            user.status = newStatus;
            Swal.fire("User status updated!", "", "success");
          },
          (error: any) => {

            console.error('Error updating user status:', error);
            Swal.fire("Failed to update user status", "", "error");
          }
        );
        this._subscription.add(statusSub); // Add subscription for status change

      } else if (result.isDenied) {
        Swal.fire("Action cancelled", "", "info");
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }









  // Calculate total number of pages
  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalItems / this.pageSize);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  // Update the paginated user list to display only the current page
  updatePaginatedList(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUserList = this.userList.slice(start, end);
  }

  // Handle page size change
  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1; // Reset to first page
    this.loadAdmin();
  }

  // Change page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages.length) {
      return;
    }
    this.currentPage = page;
    this.updatePaginatedList();
  }


}