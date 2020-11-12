import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendHttpData {

  // private baseUrl = 'http://pruebasneuro.co/N-1010/montana_backend/public/api/';
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
  httpPut(route:string, id:any, data:any, headers = false):Observable<any>{
    var url = this.baseUrl + route + '/' + id;
    if (headers) {
      return this._http.put(url, data, this.options);
    }else{
      return this._http.put(url, data);
    }
  }

  /* Peticion Http Delete */
  httpDelete(route, id):Observable<any>{
    var url = this.baseUrl + route + '/' + id;
    return this._http.delete(url, this.options);
  }

  // Peticion Http Get download.
  downloadFile(route: string, filename: string = null){
    const headers = new HttpHeaders().set('authorization','Bearer '+ localStorage.getItem('access_token'));
    this._http.get(this.baseUrl + route,{headers, responseType: 'blob' as 'json'}).subscribe(
        (response: any) =>{
            let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        }
    )
}

}
