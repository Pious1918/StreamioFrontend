import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private userServiceUrl = 'https://streamiobackend.ddns.net/user-service'
  private videoServiceUrl = 'https://streamiobackend.ddns.net/video-service'

  constructor(private http: HttpClient) { }


  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  getCurrentSearchTerm() {
    return this.searchTermSubject.value;
  }


  getUploadedVideos(){
    return this.http.get(`${this.userServiceUrl}/videos`)
  }

  updateVideo(videoId:any , updatedata:any){

    return this.http.put(`${this.videoServiceUrl}/update-video/${videoId}`, updatedata)
  }



  getBanners(){
    return this.http.get(`${this.userServiceUrl}/getbanner`)
  }


  deleteBannerfromS3(imageurl:string){
    return this.http.post(`${this.userServiceUrl}/deletefroms3`,{imageurl})
  }

  deletebanner(id:string){
    return this.http.post(`${this.userServiceUrl}/deletebanner`,{id})
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


  getUserProfile(): Observable<any> {

    return this.http.get(`${this.userServiceUrl}/userprofile`)
  }


  updatedData(newData: any) {
    console.log("from servie", newData)
    return this.http.post(`${this.userServiceUrl}/update`, newData)
  }

  GetCustomerbycode(code: any) {
    return this.http.get(`${this.userServiceUrl}/getbycode`, code);
  }


  subscribeChannel(channelId: any) {
    return this.http.post(`${this.userServiceUrl}/subscribeee`, { channelId });
  }


  unsubscribeChannel(channelId: any) {
    return this.http.post(`${this.userServiceUrl}/unsubscribe`, { channelId });
  }



  uploadFileToS33(url: string, file: File) {
    console.log("at seeee")
    return this.http.put(url, file, {
      headers: { 'Content-Type': file.type },
    });
  }

  savebannerdata(data:{title:string, description:string, image:string}){
    return this.http.post(`${this.userServiceUrl}/savebanner`,data)
  }
  


  uploadFileToS3(url: string, file: File): Observable<number> {
    console.log("here @uploads3")
    const formData: FormData = new FormData()
    formData.append('file', file, file.name)

    const req = new HttpRequest('PUT', url, file, {
      reportProgress: true,
    })


    return this.http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const percentDone = Math.round((event.loaded / event.total!) * 100)
            return percentDone

          case HttpEventType.Response:
            return 100;
          default:
            return 0;
        }
      })
    )



  }


  generateOtp(email: string) {
    return this.http.post(`${this.userServiceUrl}/generateotp`, { email })
  }


  submitOtp(otp: string, email: string) {

    return this.http.post(`${this.userServiceUrl}/submitotp`, { otp, email })
  }

  resetPassword(password: string, email: string) {
    console.log("user@service")
    return this.http.post(`${this.userServiceUrl}/resetpassword`, { password, email })
  }


  registerAdmin(admindata: any) {
    console.log("Hello from registeradmin frontend")

    return this.http.post(`${this.userServiceUrl}/adminregister`, admindata)
  }


  private email:string=''
  setEmail(email:string){
    this.email = email
  }


  getEmail():string{
    return this.email
  }


  getsubscribers(){
    return this.http.get(`${this.userServiceUrl}/subscribersList`)
  }

  getFollowingList(){
    return this.http.get(`${this.userServiceUrl}/followingList`)
  }

}
