import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendHttpData {

  // private baseUrl = 'http://pruebasneuro.co/N-1041/public/api/';
  private baseUrl = 'http://127.0.0.1:8000/api/';

  options : any;

  constructor(private _http: HttpClient) { 
    this.options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
  }

  // Peticion Http GET
  httpGet(route:string, headers = false):Observable<any>{
    var url = this.baseUrl + route;
    if (headers) {
      return this._http.get(url, this.options);
    }else{
      return this._http.get(url);
    }
  }

  // Peticion Http GET
  httpPost(route:string, data:any, headers = false):Observable<any>{
    var url = this.baseUrl + route;
    if (headers) {
      return this._http.post(url, data, this.options);
    }else{
      return this._http.post(url, data);
    }
  }

  // Peticion Http PUT
  httpPut(route:string, data:any):Observable<any>{
    var url = this.baseUrl + route;
    return this._http.put(url, data);
  }

  /* Peticion Http Delete */
  httpDelete(route, id):Observable<any>{
    var url = this.baseUrl + route + '/' + id;
    return this._http.delete(url, this.options);
  }

}
