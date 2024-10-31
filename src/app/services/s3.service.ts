import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class S3Service {



  private _userServiceUrl = 'http://localhost:5000/user-service'
  private _videoServiceUrl = 'http://localhost:5000/video-service'



  constructor(private _http:HttpClient) { }


  generateVideoPresignedurl(fileName:string , fileType:string):Observable<{presignedUrl:string}> {
    return this._http.post<{presignedUrl:string}>(`${this._videoServiceUrl}/generate-video-presigned-url`,{fileName,fileType})
  }
  




}
