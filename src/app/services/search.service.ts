import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _userServiceUrl = 'http://localhost/user-service';

  constructor(private _http:HttpClient) { }

  searchUsers(name: string): Observable<any[]> {
    return this._http.get<any[]>(`${this._userServiceUrl}/users?name=${name}`);
  }
}
