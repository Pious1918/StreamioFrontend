import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  
  private userServiceUrl = 'http://localhost:5000/user-service'

  constructor(private http: HttpClient) { }


  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  getCurrentSearchTerm() {
    return this.searchTermSubject.value;
  }




  registerUser(userData: any) {
    console.log("Hello from registeruser frontend")

    return this.http.post(`${this.userServiceUrl}/register`, userData)
  }


  checkEmail(email: string): Observable<any> {
    return this.http.get(`${this.userServiceUrl}/check-email?email=${email}`)
  }


  loginUser(userdata: any) {
    console.log(`entered @${userdata.email}`)
    return this.http.post(`${this.userServiceUrl}/login`, userdata)
  }


  getUserProfile():Observable<any>{
   
    return this.http.get(`${this.userServiceUrl}/userprofile`)
  }


  updatedData(newData:any){
    console.log("from servie",newData)
    return this.http.post(`${this.userServiceUrl}/update`,newData )
  }

  GetCustomerbycode(code:any){
    return this.http.get(`${this.userServiceUrl}/getbycode`,code);
  }


  subscribeChannel(channelId:any){
    return this.http.post(`${this.userServiceUrl}/subscribeee`,{channelId});
  }


  unsubscribeChannel(channelId:any){
    return this.http.post(`${this.userServiceUrl}/unsubscribe`,{channelId});
  }



  // uploadFileToS3(url: string, file: File) {
  //   return this.http.put(url, file, {
  //     headers: { 'Content-Type': file.type },
  //   });
  // }


  uploadFileToS3(url:string , file:File):Observable<number>{
    const formData :FormData = new FormData()
    formData.append('file',file , file.name)

    const req = new HttpRequest('PUT',url , file, {
      reportProgress:true,
    })


    return this.http.request(req).pipe(
      map(event=>{
        switch(event.type){
          case HttpEventType.UploadProgress:
            const percentDone = Math.round((event.loaded / event.total!) *100)
            return percentDone

          case HttpEventType.Response:
            return 100;
          default:
            return 0;    
        }
      })
    )



  }

  

  registerAdmin(admindata: any) {
    console.log("Hello from registeradmin frontend")

    return this.http.post(`${this.userServiceUrl}/adminregister`, admindata)
  }
}
