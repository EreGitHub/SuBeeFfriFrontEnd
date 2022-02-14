import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }

  post(url: string, data: any) {
    return this.http.post(environment.baseUrl + url, data).toPromise();
  }
  put(url: string, data: any) {    
    return this.http.put(environment.baseUrl + url, data).toPromise();
  }
  get(url: string) {
    return this.http.get(environment.baseUrl + url).toPromise();
  }
  getObservable(url: string) {
    return this.http.get(environment.baseUrl + url);
  }
  delete(url: string, data?: any) {
    return this.http.delete(environment.baseUrl + url, data).toPromise();
  }
}
