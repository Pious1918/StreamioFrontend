import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private userServiceUrl = 'http://localhost:5000/user-service'

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


 loadAdmindash(page: number = 1, limit: number = 6){
   console.log("Hai from admindash")
   return this.http.get(`${this.userServiceUrl}/userlist?page=${page}&limit=${limit}`)
 }


 changeStatus(status:string  , userId:any){
   console.log("@service")
   return this.http.put(`${this.userServiceUrl}/userds/${userId}/status`,{status})
 }
}
