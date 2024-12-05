import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveService {

  private _formDataSubject = new BehaviorSubject<{title:string, description:string, imageurl:string} | null>(null);
  formData$= this._formDataSubject.asObservable()

  private _liveServiceUrl = 'http://localhost:5000/live-service'


  private streamDataSubject = new BehaviorSubject<any>(null);
  streamData$ = this.streamDataSubject.asObservable();


  constructor(private _http: HttpClient) { }


  setStreamData(data:any){
    this.streamDataSubject.next(data)
  }



  updateFormData(data :{title:string , description:string , imageurl:string}){
    this._formDataSubject.next(data)
  }


  saveLiveDetails(livedata:any){

    return this._http.post(`${this._liveServiceUrl}/saveStreamdata`,livedata)
  }

  deleteLiveDetails(roomid:string){
    return this._http.delete(`${this._liveServiceUrl}/deleteStreamdata/${roomid}`)
  }


  getOngoinglive(){
    return this._http.get(`${this._liveServiceUrl}/getalllives`)
  }


}
