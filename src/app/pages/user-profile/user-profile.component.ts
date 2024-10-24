import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { UserService } from '../../services/user.service';
import { select, Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { loadUserProfile, updateProfilePicture, updateUserProfile } from '../../store/user.action';
import { interval, Observable, Subscription } from 'rxjs';
import { selectUser } from '../../store/user.selector';
import { HttpClient } from '@angular/common/http';



/**
 * UserProfileComponent is responsible for managing and displaying the user's profile.
 * It allows the user to edit their profile information and upload a profile picture.
 */
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  isProfileVisible = false;
  isEditing = false;
  isPreviewing: boolean = false

  userProfile: any;
  defaultImage: string = "assets/avathar.jpg"
  user$: Observable<any>
  originalUserProfile: any; // just to store the original user data for backup

  selectedImage: string | ArrayBuffer | null = null; // to store selected image
  selectedFile: File | null = null;  // to store the actual file for uploading
  uploadProgress: string = '';

  data$ = interval(1000)
  private subscription!: Subscription;
  datasubscribion!: Subscription;

  constructor(
    private _userService: UserService,
    private _store: Store,
    private _http: HttpClient
  ) {

    this.user$ = this._store.pipe(select(selectUser));
  }


  ngOnInit(): void {
    this._store.dispatch(loadUserProfile());

    this.subscription = this.user$.subscribe((user: any) => {
      if (user && user.updatedProfile) {
        this.userProfile = { ...user.updatedProfile };
      } else {
        this.userProfile = { ...user.userProfile };
      }

      console.log("this.userpro", this.userProfile)
      // Create a backup of the original profile when the component is first loaded
      this.originalUserProfile = { ...this.userProfile };
    });


    this.datasubscribion = this.data$.subscribe((data) => {
      console.log("data is", data)
    })
  }





  toggleProfile(): void {
    this.isProfileVisible = !this.isProfileVisible;
  }


  startEditing(): void {
    this.isEditing = true;
  }



  /**
   * Saves the changes made to the user's profile.
   */
  saveChanges(): void {
     if (JSON.stringify(this.userProfile) === JSON.stringify(this.originalUserProfile)) {
    console.log("No changes made, not calling api unnecessarily");
    this.isEditing = false;
    return; // Exit the function without making an API call
  }
    this.isEditing = false;
    console.log("new ", this.userProfile)
    this._store.dispatch(updateUserProfile({ user: this.userProfile }))
    this.originalUserProfile = { ...this.userProfile };
  }

  /**
   * Cancels editing, discarding changes and resetting to the original profile.
   */
  cancelEditing(): void {
    this.isEditing = false;
    this.userProfile = { ...this.originalUserProfile };
  }




  /**
   * Handles image selection for the profile picture.
   * @param event - The change event triggered by the file input.
   */
  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isPreviewing = true;
      this.selectedFile = file;
      this.selectedImage = URL.createObjectURL(file);  // Generate a URL for the image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  //method to save the selected image
  async saveImage() {
    console.log("fdsfsd", this.selectedFile);

    if (!this.selectedFile) {
      console.log("no file selected");
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log("formData", this.selectedFile);
    console.log("fileName", this.selectedFile.name)
    console.log('fileType', this.selectedFile.type)
    const fileName = this.selectedFile.name;
    const fileType = this.selectedFile.type;
    //generating presigned url
    const presignedUrlResponse: any = await this._http.post('http://localhost:5000/user-service/generate-presigned-url', { fileName, fileType }).toPromise();
    const presignedUrl = presignedUrlResponse.presignedUrl;

    console.log("pressere", presignedUrl)

    //uploading to s3 bucket using presigned url
    this._userService.uploadFileToS3(presignedUrl, this.selectedFile).subscribe((res) => {


      const s3FileUrl = presignedUrl.split('?')[0];  
      console.log("File URL:", s3FileUrl);
      this.uploadProgress = 'File upload successful! S3 URL: ' + s3FileUrl;
      this._store.dispatch(updateProfilePicture({ s3FileUrl }));  


    }, (error) => {
    
      console.log("error upload", error)
    }
    )
    this.isPreviewing = false; 
  }


    /**
   * Cancels the image selection and resets the preview.
   */
  cancelImage(): void {
    this.selectedImage = null; // Reset selected image
    this.isPreviewing = false;
  }



    /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.datasubscribion.unsubscribe()
    this.subscription.unsubscribe()
  }

}