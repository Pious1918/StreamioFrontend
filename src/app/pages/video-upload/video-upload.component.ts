import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { S3Service } from '../../services/s3.service';
import { VideoService } from '../../services/video.service';
import Swal from 'sweetalert2'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { catchError, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, SidepanelComponent, MatProgressBarModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.css'
})
export class VideoUploadComponent {
  selectedFileName: string | null = null;
  selectedFile: File | null = null;  // to store the actual file for uploading



  selectedThumbnailFileName: string | null = null;
  selectedThumbnailFile: File | null = null;  // to store the actual file for uploading




  uploadform!: FormGroup
  constructor(private _formBuilder: FormBuilder,
    private _http: HttpClient,
    private _userservice: UserService,
    private _s3service: S3Service,
    private _videoService: VideoService,
    private _router: Router
  ) {

    this.uploadform = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      visibility: ['public', Validators.required],
      payment: ['unpaid', Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      category: ['', Validators.required],
      thumbnail: ['', Validators.required],
      video: ['', Validators.required],
    });



  }

  onFileSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      this.selectedFileName = file.name; // Save the file name to display or use
      this.selectedFile = file
      console.log('Selected file:', file);

      console.log("fiele is", this.selectedFile)
    }
  }


  onPaymentChange(): void {
    const payment = this.uploadform.get('payment')?.value;
    const priceControl = this.uploadform.get('price');

    if (payment === 'paid') {
      priceControl?.enable();
      priceControl?.setValidators(Validators.required);
    } else {
      priceControl?.disable();
      priceControl?.clearValidators();
    }

    priceControl?.updateValueAndValidity();
  }

  uploadProgress: number = 0; // Initialize progress

  // --------------------------------------------------------------------------------------------------------------------

  /**
   * Handles form submission to upload video
   * @async
   * @function
   * @returns {Promise<void>}
   * @throws will log an error to console the form is invalid
   */

  async onSubmit(): Promise<void> {
    if (this.uploadform.valid && this.selectedFile && this.selectedThumbnailFile) {
      const formData = new FormData();

      // Append each form control value to FormData
      formData.append('title', this.uploadform.get('title')?.value);
      formData.append('description', this.uploadform.get('description')?.value);
      formData.append('visibility', this.uploadform.get('visibility')?.value);
      formData.append('payment', this.uploadform.get('payment')?.value);
      formData.append('price', this.uploadform.get('price')?.value);
      formData.append('category', this.uploadform.get('category')?.value);

      const fileName = this.selectedFile.name;
      const fileType = this.selectedFile.type;

      const thumbnailFileName = this.selectedThumbnailFile.name;
      const thumbnailFileType = this.selectedThumbnailFile.type;


      // Generate presigned URL
      const res = await this._s3service.generateVideoPresignedurl(fileName, fileType).toPromise();

      const thumbnailPresignedUrlRes = await this._s3service.generateVideoPresignedurl(thumbnailFileName, thumbnailFileType).toPromise();
      console.log("thumbnailPresignedUrlRes", thumbnailPresignedUrlRes)


      if (res && res.presignedUrl && thumbnailPresignedUrlRes && thumbnailPresignedUrlRes.presignedUrl) {
        const presignedUrl = res.presignedUrl;
        const thumbnailPresignedUrl = thumbnailPresignedUrlRes.presignedUrl;

        console.log("Presigned URL:", presignedUrl);
        console.log("thumbnail presigned urrl:", thumbnailPresignedUrl);

        // Upload thumbnail to S3
        const thumbnailUpload$ = this._userservice.uploadFileToS3(thumbnailPresignedUrl, this.selectedThumbnailFile).pipe(
          catchError((err) => {
            console.error('Error uploading thumbnail:', err);
            throw err;
          })
        );


        // Upload video to S3 with progress tracking
        const videoUpload$ = this._userservice.uploadFileToS3(presignedUrl, this.selectedFile).pipe(
          catchError((err) => {
            console.error('Error uploading video:', err);
            throw err;
          })
        );


        // Start both uploads in parallel
        videoUpload$.subscribe({
          next: (progress) => {
            this.uploadProgress = progress; // Update video upload progress
            console.log(`Video Upload Progress: ${progress}%`);
          },
          error: (error) => {
            console.error("Error uploading video:", error);
          },
          complete: async () => {
            console.log("Video upload completed successfully");
            const videoUrl = presignedUrl.split('?')[0];
            const thumbnailUrl = thumbnailPresignedUrl.split('?')[0];

            try {
              // Send backend data after uploads complete
              const backendData = {
                title: this.uploadform.get('title')?.value,
                description: this.uploadform.get('description')?.value,
                visibility: this.uploadform.get('visibility')?.value,
                payment: this.uploadform.get('payment')?.value,
                price: this.uploadform.get('price')?.value,
                category: this.uploadform.get('category')?.value,

                videoUrl,
                thumbnailUrl
              };

              console.log("Sending data to backend:", backendData);

              // Convert video to HLS format
              const hlsResponse = await lastValueFrom(this._videoService.convertHLS(backendData));
              console.log("HLS Conversion Response:", hlsResponse);

              // Show success message after upload and conversion
              this.showsuccess();
            } catch (error) {
              console.error("Error during HLS conversion or backend data submission:", error);
            }
          }
        });

        thumbnailUpload$.subscribe({
          next: () => console.log("Thumbnail uploading..."),
          complete: () => console.log("Thumbnail upload completed successfully"),
        });







        // Upload to S3 and track progress
        // this._userservice.uploadFileToS3(presignedUrl, this.selectedFile).subscribe({
        //   next: (progress) => {
        //     this.uploadProgress = progress; // Update progress
        //     console.log(`Upload Progress: ${progress}%`);
        //   },
        //   error: (error) => {
        //     console.log("Error uploading", error);
        //   },
        //   complete: async () => {
        //     console.log("Upload completed successfully");

        //     const s3FileUrl = presignedUrl.split('?')[0];
        //     const backendData = {
        //       title: this.uploadform.get('title')?.value,
        //       description: this.uploadform.get('description')?.value,
        //       visibility: this.uploadform.get('visibility')?.value,
        //       payment: this.uploadform.get('payment')?.value,
        //       price: this.uploadform.get('price')?.value,
        //       category: this.uploadform.get('category')?.value,
        //       fileUrl: s3FileUrl
        //     };

        //     try {
        //       // Convert to HLS and wait for completion
        //       const hlsresponse = await lastValueFrom(this._videoService.convertHLS(backendData));
        //       console.log("HLS Response:", hlsresponse);

        //       // Show success message after both upload and conversion are complete
        //       this.showsuccess();

        //       // this._router.navigate(['']);
        //     } catch (error) {
        //       console.error("Error converting to HLS", error);
        //     }
        //   }
        // });
      } else {
        console.error("Failed to get presigned URL");
      }
    } else {
      console.error('Form is invalid or file not selected');
    }
  }




  showsuccess() {
    Swal.fire({
      title: 'Video uploaded successfully',

      icon: 'success',
      toast: true,
      position: 'top-end', // Common toast position for a notification
      showConfirmButton: false, // Optional: No confirm button for toast
      timer: 3000 // Display for 3 seconds
    });
  }




  thumbnailPreview: string | null = null; // To hold the preview URL

  onThumbnailSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {

      console.log("file @ thumbnail", file)

      this.selectedThumbnailFile = file; // Save the file for upload later
      this.selectedThumbnailFileName = file.name;

      // Use FileReader to generate a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreview = reader.result as string; // Save the preview URL
      };
      reader.readAsDataURL(file);
    }
  }






}
