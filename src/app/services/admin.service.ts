import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userServiceUrl = 'http://localhost:5000/user-service'
  private videoServiceUrl = 'http://localhost:5000/video-service'

  constructor(private http: HttpClient) { }

  ///admin related 
  loginAdmin(admindata:any){
   console.log("entered admin data ",admindata.email)
   return this.http.post(`${this.userServiceUrl}/adminlogin`,admindata)
 }


 registerAdmin(admindata: any) {
   console.log("Hello from registeradmin frontend")

   return this.http.post(`${this.userServiceUrl}/adminregister`, admindata)
 }


//  loadAdmindash(page: number = 1, limit: number = 6){
//    console.log("Hai from admindash")
//    return this.http.get(`${this.userServiceUrl}/userlist?page=${page}&limit=${limit}`)
//  }
loadAdmindash(page: number = 1, limit: number = 6, search: string = '') {
  console.log('Loading users with search term:', search);
  return this.http.get(
    `${this.userServiceUrl}/userlist?page=${page}&limit=${limit}&search=${search}`
  );
}



 changeStatus(status:string  , userId:any){
   console.log("@service")
   return this.http.put(`${this.userServiceUrl}/userds/${userId}/status`,{status})
 }


 getAlluserCount(){
  return this.http.get(`${this.userServiceUrl}/countuser`)
 }


 topfivevideos(){
  return this.http.get(`${this.videoServiceUrl}/topfive`)
 }

}
