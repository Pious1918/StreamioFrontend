import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private userServiceUrl = 'http://localhost:5000/user-service'

  constructor(private http: HttpClient) { }


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



  uploadFileToS3(url: string, file: File) {
    return this.http.put(url, file, {
      headers: { 'Content-Type': file.type },
    });
  }


  

  registerAdmin(admindata: any) {
    console.log("Hello from registeradmin frontend")

    return this.http.post(`${this.userServiceUrl}/adminregister`, admindata)
  }
}
