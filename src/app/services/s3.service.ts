import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class S3Service {



  private _userServiceUrl = 'https://streamiobackend.ddns.net/user-service'
  private _videoServiceUrl = 'https://streamiobackend.ddns.net/video-service'
  private _liveServiceUrl = 'https://streamiobackend.ddns.net/live-service'



  constructor(private _http:HttpClient) { }


  generateVideoPresignedurl(fileName:string , fileType:string):Observable<{presignedUrl:string}> {
    return this._http.post<{presignedUrl:string}>(`${this._videoServiceUrl}/generate-video-presigned-url`,{fileName,fileType})
  }
  

  generates3URL(bucketname:string, fileName:string, fileType:string):Observable<{presignedUrl:string}>{
    return this._http.post<{presignedUrl:string}>(`${this._userServiceUrl}/generateCommonPresigner`,{bucketname,fileName,fileType})
  }



  generatelivePresignedurl(fileName:string , fileType:string):Observable<{presignedUrl:string}> {
    return this._http.post<{presignedUrl:string}>(`${this._liveServiceUrl}/generate-presigned-url`,{fileName,fileType})
  }
  


  
  uploadFileToS33(url: string, file: File) {
    console.log("at seeee")
    return this._http.put(url, file, {
      headers: { 'Content-Type': file.type },
    });
  }


}
