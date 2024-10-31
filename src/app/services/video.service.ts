import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IvideoDocument } from '../pages/user-home/home.component';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private _videoServiceUrl = 'http://localhost:5000/video-service'
  constructor(private _http:HttpClient) { }

  saveVideoData(videData:any):Observable<any>{

    return this._http.post(`${this._videoServiceUrl}/save-video-data`,videData)
  }


  getAllVideos(): Observable<IvideoDocument[]>{
    return this._http.get<IvideoDocument[]>(`${this._videoServiceUrl}/videos`)
  }


  getIndividualVideos(movieId:string){
    return this._http.get<IvideoDocument>(`${this._videoServiceUrl}/video/${movieId}`)
  }


  getUploadedVideos():Observable<IvideoDocument[]>{
    return this._http.get<IvideoDocument[]>(`${this._videoServiceUrl}/getuseruploadedvideo`)
  }


}
