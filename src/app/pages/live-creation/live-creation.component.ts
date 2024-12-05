import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/user-header/header.component';
import { SidepanelComponent } from '../../shared/components/user-sidepanel/sidepanel.component';
import { S3Service } from '../../services/s3.service';
import { LiveService } from '../../services/live.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-creation',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HeaderComponent, SidepanelComponent],
  templateUrl: './live-creation.component.html',
  styleUrl: './live-creation.component.css'
})
export class LiveCreationComponent {

  liveform!: FormGroup
  title: string = '';
  description: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;  // to store the actual file for uploading


  constructor(private _formBuilder: FormBuilder, private _s3service: S3Service, private _liveservice:LiveService, private _router:Router) {

    this.liveform = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    })
  }


  onImageSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFile = file
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  preURLSigned!:string


  submitForm(): void {


    if (!this.selectedFile) {
      console.log("No file selected");
      return;
    }

    if (this.liveform.valid) {
      const formData = new FormData();
      formData.append('file',this.selectedFile)


      const fileName = this.selectedFile.name
      const fileType = this.selectedFile.type
      this.title = this.liveform.value.title
      this.description = this.liveform.value.description
      console.log("title and descripti",this.title ,this.description)

      //generating presigned url
      this._s3service.generatelivePresignedurl(fileName, fileType).subscribe((res) => {
        console.log("resp presig live", res.presignedUrl)

        this.preURLSigned=res.presignedUrl

        this._s3service.uploadFileToS33(this.preURLSigned, this.selectedFile!).subscribe((res) => {
          console.log(res)

          const s3FileUrl = this.preURLSigned.split('?')[0]
          console.log("file url",s3FileUrl)

          this._liveservice.updateFormData({
            title:this.title,
            description:this.description,
            imageurl:s3FileUrl
          })

          this._router.navigate(['/live'])
        })



      })
   


    }
  }
}
