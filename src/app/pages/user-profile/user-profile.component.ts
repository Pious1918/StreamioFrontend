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
import { VideoService } from '../../services/video.service';
import { IvideoDocument } from '../user-home/home.component';
import { RelativetimePipe } from '../../shared/pipes/relativetime.pipe';
import { Router, RouterModule } from '@angular/router';



/**
 * UserProfileComponent is responsible for managing and displaying the user's profile.
 * It allows the user to edit their profile information and upload a profile picture.
 */
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent, SidepanelComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {




  allvideos: any[] = [];
  privatevideos: any[] = [];
  watchlatervideos: any[] = [];
  reportVideos: any[] = [];

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

  isreportModalOpen: boolean = false;


  private subscription!: Subscription;
  datasubscribion!: Subscription;

  constructor(
    private _userService: UserService,
    private _store: Store,
    private _http: HttpClient,
    private _videoService: VideoService,
    private router: Router
  ) {

    this.user$ = this._store.pipe(select(selectUser));
  }
  userId: string = ''

  originalVideo: any = {};

  selectedVideo: any = {}; // Store the selected video for editing
  isModalOpen: boolean = false; // Control modal visibility


  ngOnInit(): void {
    this._store.dispatch(loadUserProfile());

    this.subscription = this.user$.subscribe((user: any) => {

      this.userId = user._id
      if (user && user.updatedProfile) {
        this.userProfile = { ...user.updatedProfile };
      } else {
        this.userProfile = { ...user.userProfile };
        console.log("fdfafasfdsfasf", this.userId)
      }

      console.log("this.userpro", this.userProfile)
      // Create a backup of the original profile when the component is first loaded
      this.originalUserProfile = { ...this.userProfile };



    });

    this.uploadedVideos()




  }


  ngAfterViewInit(): void {


    this.privatevideosOnly()
    this.fetchwaterLaterVideos()

    this.fetchReportVideos()

  }

  activeTab = 'uploaded';  // Default active tab

  // Function to set the active tab
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }



  async uploadedVideos() {

    this._videoService.getUploadedVideos().subscribe((res: any) => {
      console.log("response is fromm uploaded videoss", res)
      this.allvideos = res
    })
  }


  privatevideosOnly() {

    this._videoService.getPrivatevideos().subscribe((res: any) => {
      console.log("res @ privatevideosonly ", res)
      this.privatevideos = res.videos

    })
  }


  fetchwaterLaterVideos() {
    this._videoService.getwatchlater().subscribe((res: any) => {
      console.log("response form watch later", res)

      this.watchlatervideos = res.videos

    })
  }


  fetchReportVideos(){
    this._videoService.reportVideos().subscribe((res:any)=>{
      console.log("fetched reported videos are",res)

      this.reportVideos=res.videos
    })
  }


  openModal(movie: any) {
    this.selectedVideo = { ...movie }; 
    this.originalVideo = { ...movie }; 
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false; // Close the modal
  }

  // Update video details after editing
  updateVideo() {
    const updatedFields: any = {};

    // Checking if any of the fields have changed
    if (this.selectedVideo.title !== this.originalVideo.title) {
      updatedFields.title = this.selectedVideo.title;
    }
    if (this.selectedVideo.description !== this.originalVideo.description) {
      updatedFields.description = this.selectedVideo.description;
    }
    if (this.selectedVideo.visibility !== this.originalVideo.visibility) {
      updatedFields.visibility = this.selectedVideo.visibility;
    }

    if (Object.keys(updatedFields).length > 0) {
      console.log('Updated fields:', updatedFields);


      if (this.originalVideo.visibility === 'private' && this.selectedVideo.visibility === 'public') {
        // Remove from privatevideos array
        const index = this.privatevideos.findIndex(video => video._id === this.selectedVideo._id);
        if (index !== -1) {
          this.privatevideos.splice(index, 1);
        }
      } else if (this.originalVideo.visibility === 'public' && this.selectedVideo.visibility === 'private') {
        // Add to privatevideos array
        this.privatevideos.push(this.selectedVideo);
      }



      // Call the service to update the video details
      this._userService.updateVideo(this.selectedVideo._id, updatedFields).subscribe((response: any) => {
        console.log('Video updated', response);
        this.isModalOpen = false; // Close the modal after saving
      });
    } else {
      console.log('No changes detected, no update made.');
    }
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
      console.log("sdfewrwew", this.selectedFile)
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
    const presignedUrlResponse: any = await this._http.post('https://streamiobackend.ddns.net/user-service/generate-presigned-url', { fileName, fileType }).toPromise();
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



  onMovieClick(movieId: string): void {

    console.log("id is ", movieId)
    this.router.navigate(['/video', movieId])

  }


  /**
 * Cleans up subscriptions when the component is destroyed.
 */
  ngOnDestroy(): void {
    if (this.datasubscribion) {
      this.datasubscribion.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  trackById(index: number, item: any): any {
    return item._id;
  }

  
  trackByMovieId(index: number, movie: any): string {
    return movie._id;
  }



  onReportvideoClick(videoId:string){
    console.log("review video id on clickin",videoId)
    this.router.navigate(['/reportvideo', videoId])
  }


  openreportDetailsmodal() {
    console.log("report modal clicked")
    this.isreportModalOpen = true;
  }

  // Method to close the modal
  closereportDetailsmodal() {
    this.isreportModalOpen = false;
  }

}