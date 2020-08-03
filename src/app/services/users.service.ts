import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = 'http://localhost/montana_backend/public/api';
  web = 'http://localhost/montana_backend/public';

  constructor( private http: HttpClient ) {}

  /* Traer todos los usuarios */
  getAllUsers(){
    return this.http.get(`${this.url}/users`);
  }

  /* Traer todos los roles */
  getRoles(){
    return this.http.get(`${this.url}/roles`);
  }

  /* Traer usuarios por rol */
  getUserForRol(id){
    return this.http.get(`${this.web}/users-for-rol/${id}`);
  }

  /* Agregar información adicional del usuario */
  setUserData(data){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.url}/userdata`,data, {headers: headers});
  }

  searchAdmin(name){
    return this.http.get(`${this.web}/users-admin`,name);
  }


  /* Crear usuario */
  createUser(user){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.url}/users`,user, {headers: headers});
  }

  /* Clientes asianados */
  clientesAsignados(id){
    return this.http.get(`${this.web}/relacion/${id}`);
  }



  createAdmin(admin){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.url}/create-admin`,admin, {headers: headers});
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
