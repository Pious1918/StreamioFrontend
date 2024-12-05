import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { S3Service } from '../../services/s3.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-banner-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,FormsModule],
  templateUrl: './admin-banner-management.component.html',
  styleUrl: './admin-banner-management.component.css'
})
export class AdminBannerManagementComponent {
  imagePreview: string | null = null;
  selectedFile: File | null = null;  // to store the actual file for uploading
  bannerForm!: FormGroup
  title:string =''
  description:string=''


  constructor(private _http:HttpClient, private _fb:FormBuilder, private _s3service:S3Service, private _userService: UserService, private _router:Router){


    this.bannerForm = this._fb.group({
      title:['',Validators.required],
      description:['',Validators.required]
    })
  }



  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      this.selectedFile=file
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
      console.log("photofile",this.selectedFile)
    } else {
      this.imagePreview = null;
    }
  }


bucketname='bannerstreamio'
preURLSigned!:string



onSave() {
  if (!this.selectedFile) {
    console.log("No file selected");
    return;
  }

  if (this.bannerForm.valid) {
    console.log("Valid form");

    const title = this.bannerForm.value.title
    const description = this.bannerForm.value.description
    console.log("title and descript",title,description)


    const formData = new FormData();
    formData.append('file', this.selectedFile);
    const fileName = this.selectedFile.name;
    const fileType = this.selectedFile.type;

    // Generate the presigned URL first
    this._s3service.generates3URL(this.bucketname, fileName, fileType).subscribe({
      next: (response) => {
        console.log("Generated URL", response.presignedUrl);
        this.preURLSigned = response.presignedUrl;

        // After the URL is generated, upload the file
        this._userService.uploadFileToS33(this.preURLSigned, this.selectedFile!).subscribe({
          next: (res) => {
            console.log("Response after upload:", res);
            const s3FileUrl = this.preURLSigned.split('?')[0];
            console.log("File URL:", s3FileUrl);

            const saveBannerdata ={
              title :this.bannerForm.value.title,
              description:this.bannerForm.value.description,
              image:s3FileUrl
            }

            this._userService.savebannerdata(saveBannerdata).subscribe({
              next:(saveresponse)=>{
                console.log("data saved succesfully",saveresponse)
                this._router.navigate(['/admin/banner'])
                this.showsuccess()
              },

              error:(saveError)=>{
                console.error("error saving data",saveError)
              }
            })







          },
          error: (uploadError) => {
            console.error("Error uploading file:", uploadError);
          }
        });
      },
      error: (error) => {
        console.error("Error generating S3 URL:", error);
      }
    });






  }
}




showsuccess() {
  Swal.fire({
    title: 'Banner added Successfully',

    icon: 'success',
    toast: true,
    position: 'top-end', // Common toast position for a notification
    showConfirmButton: false, // Optional: No confirm button for toast
    timer: 3000 // Display for 3 seconds
  });
}



}
