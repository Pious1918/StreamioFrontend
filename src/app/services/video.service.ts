import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IvideoDocument } from '../pages/user-home/home.component';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private _videoServiceUrl = 'http://localhost:5000/video-service'
  private _commentServiceUrl = 'http://localhost:5000/comment-service'
  constructor(private _http:HttpClient) { }


  uploadvideoasHLS(videodata:any):Observable<any>{
    console.log("herea I reached")
    return this._http.post(`${this._videoServiceUrl}/uploadasHLS`,videodata)

  }


  convertHLS(videodata:any):Observable<any>{
    return this._http.post(`${this._videoServiceUrl}/convert`,videodata)
  }






  saveVideoData(videData:any):Observable<any>{

    return this._http.post(`${this._videoServiceUrl}/save-video-data`,videData)
  }


  incrementviews(videoId:string){
    return this._http.put(`${this._videoServiceUrl}/updateviews`,{videoId})
  }


  getAllVideos(): Observable<IvideoDocument[]>{
    return this._http.get<IvideoDocument[]>(`${this._videoServiceUrl}/videos`)
  }


  getIndividualVideos(movieId:string){
    return this._http.get<IvideoDocument>(`${this._videoServiceUrl}/video/${movieId}`)
    // return this._http.get(`${this._videoServiceUrl}/video/${movieId}/hls`);

  }


  getUploadedVideos():Observable<IvideoDocument[]>{
    return this._http.get<IvideoDocument[]>(`${this._videoServiceUrl}/getuseruploadedvideo`)
  }


  fetchotherVideo(videoId:string):Observable<IvideoDocument[]>{
    return this._http.get<IvideoDocument[]>(`${this._videoServiceUrl}/fetchOther/${videoId}`)
  }


  replyComment(commentData:any){
    return this._http.post(`${this._commentServiceUrl}/reply`,commentData)
  }


  likeVideo(videoId:string){
    return this._http.post(`${this._videoServiceUrl}/likevideo`,{videoId})
  }

  unlikeVideo(videoId:string){
    return this._http.post(`${this._videoServiceUrl}/unlike`,{videoId})
  }


  getlikedvideos(){
    return this._http.get(`${this._videoServiceUrl}/likedvideos`)
  }


  getPrivatevideos(){
    return this._http.get(`${this._videoServiceUrl}/getprivatevideos`)
  }


  updateSavewatchlater(videoId:string){

    return this._http.post(`${this._videoServiceUrl}/savewatchlater`,{videoId})
  }

  getwatchlater(){
    return this._http.get(`${this._videoServiceUrl}/getwatchlatervideos`)

  }

}
