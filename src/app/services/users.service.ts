import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = 'http://localhost/athletic-api/public/api';
  web = 'http://localhost/athletic-api/public';

  constructor( private http: HttpClient ) {}

  createAdmin(admin){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.url}/create-admin`,admin, {headers: headers});
  }

  getAllUsers(){
    return this.http.get(`${this.url}/users`);
  }
  
  getUserForRol(id){
    return this.http.get(`${this.web}/user-rol/${id}`);
  }

  getAllSellers(){
    return this.http.get(`${this.web}/vendedores`);
  }

  getSeller(id){
    return this.http.get(`${this.web}/vendedor/${id}`);
  }

  getAllClients(){
    return this.http.get(`${this.web}/clientes`);
  }

  getClient(id){
    return this.http.get(`${this.web}/cliente/${id}`);
  }

  getOneAdministor(id){
    return this.http.get(`${this.url}/administradores/${id}`);
  }

  createRol(rol){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.url}/roles`,rol, {headers: headers});
  }

  readRoles(){
    return this.http.get(`${this.url}/roles`);
  }

  updateRol(rol){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.put(`${this.url}/roles/${rol.id}`,rol, {headers: headers});
  }

	deleteRol(id){
		return this.http.delete(`${this.url}/roles/${id}`,id);
	}

}
