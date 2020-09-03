import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Local
  authUrl = 'http://localhost/montana_backend/public/api/auth/login';
  apiUrl = 'http://localhost/montana_backend/public/api';

  // Producción
  // authUrl = 'http://pruebasneuro.co/N-1010/montana_backend/public/api/auth/login';
  // apiUrl = 'http://pruebasneuro.co/N-1010/montana_backend/public/api';

  options: any;

  userToken: string;

  constructor( private http: HttpClient ) {
    this.seeToken();
    this.options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    };
  }

  // login(e: string, p: string) {
  //   // const headers = new HttpHeaders( {'Content-Type':'application/json'} );
  //   // return this.http.post(`${this.authUrl}`,{headers: headers});
  //   return this.http.post(this.authUrl, {
  //     // grant_type: 'password',
  //     // client_id: '2',
  //     // client_secret: 'srKHlpLcnyLaBhZmQsAIuztgY7C0N8gjZPFKjYgu',
  //     username: e,
  //     password: p,
  //     // scope: ''
  //   }, this.options);
  // }

  login(credenciales) {
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.authUrl}`,credenciales,{headers: headers}).pipe(
      map(res=>{
        this.saveToken(res['access_token']);
        return res;
      })
    );
  }

  logout() {
    this.options.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token');
    return this.http.get(this.apiUrl + '/token/revoke', this.options);
  }

  private saveToken(idToken: string){
    this.userToken = idToken;
    localStorage.setItem('access_token', idToken);
  }

  seeToken(){
    if(localStorage.getItem('access_token')){
      this.userToken = localStorage.getItem('access_token');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  authOn(): boolean{
    return this.userToken.length > 2;
  }


}
