import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AmplicacionCupoService {

  apiUrl = 'https://pruebasneuro.co/N-1010/montana_backend/public/api';

  constructor(private http: HttpClient) { }


  getAumentarCupo(){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.apiUrl}/ampliacion-cupo`, {headers: headers}).pipe( map( resp => resp['solicitudes']))
  }


}
