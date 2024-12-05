import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interfaces';
import { UserStatus } from '../../enums/userStatusenum';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';







@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent implements OnInit {

  defaultProfilePic: string = './assets/avathar.jpg'


  filters = {
  
    searchTerm: '',
   
  };

  userList: any[] = []

  // Pagination variables


  currentPage: number = 1;
  totalPages: number = 0;
  limit: number = 5;

  searchTerm: string = '';
  searchTermSubject = new Subject<string>()

  private _subscription: Subscription = new Subscription(); // To track all subscriptions

  constructor(private _adminservice: AdminService, private _userService:UserService, private _router: Router) { }

  ngOnInit(): void {
    this.loadAdmin(this.currentPage);


        // Debouncing search input
        const searchSub = this.searchSubject.pipe(debounceTime(300)).subscribe((term: string) => {
          this.searchTerm = term; // Update the search term
          this.loadAdmin(this.currentPage, term); // Load users with the search term
        });

  }


  loadAdmin(page: number, search:string='') {
    const adminSub = this._adminservice.loadAdmindash(page, this.limit , search).subscribe((res: any) => {
      console.log(res.users)
      this.userList = res.users
      this.totalPages = res.totalPages;
      this.currentPage = res.currentPage;
      console.log("resopons is ", res)

      console.log("total page is ", this.totalPages)
      console.log("total page is ", this.totalPages)
      console.log("res.currentPage ", this.currentPage)

    })

    this._subscription.add(adminSub); // Add to subscription tracker

  }


  changePage(page: number): void {
    console.log("hai from change page")
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAdmin(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
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



  onSearchTermChange(term: string) {
    this.searchTerm = term
    this._userService.updateSearchTerm(term)
    this.searchTermSubject.next(term)
  }


  // onSearch() {
  //   if (this.searchTerm.trim()) {
  //     this._router.navigate(['/results'], { queryParams: { query: this.searchTerm } });
  //   }
  // }


  clearSearch() {
    this.searchTerm = '';
    this._userService.updateSearchTerm('')

  }
  searchSubject: Subject<string> = new Subject<string>();
  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm); 
  }




}