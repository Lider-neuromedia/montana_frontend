import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Local
  api = 'http://localhost/montana_backend/public/api';
  web = 'http://localhost/montana_backend/public';
  
  // Producción
  // api = 'http://pruebasneuro.co/N-1010/montana_backend/public/api';
  // web = 'http://pruebasneuro.co/N-1010/montana_backend/public';

  constructor( private http: HttpClient ) {}

  /* Traer todos los usuarios */
  getAllUsers(){
    return this.http.get(`${this.api}/users`);
  }

  /* Traer todos los roles */
  getRoles(){
    return this.http.get(`${this.api}/roles`);
  }

  /* Traer usuarios por rol */
  getUserForRol(id){
    return this.http.get(`${this.web}/users-for-rol/${id}`);
  }

  /* Agregar información adicional del usuario */
  setUserData(data){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/userdata`,data, {headers: headers});
  }

  searchAdmin(name){
    return this.http.get(`${this.web}/users-admin`,name);
  }

  /* Crear usuario */
  createUser(user){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/users`,user, {headers: headers});
  }

  /* Eliminar un usuario */
  deleteUser(users){
    return this.http.delete(`${this.api}/users/${users}`,users);
  }

  /* Eliminar varios usuario */
  deleteUsers(users){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/delete-users`,users,{headers: headers});
  }

  /* Clientes asianados */
  clientesAsignados(cliente){
    // return this.http.get(`${this.web}/relacion/${id}`);
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/asignar-cliente`,cliente,{headers: headers});
  }



  createAdmin(admin){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/create-admin`,admin, {headers: headers});
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
    return this.http.get(`${this.api}/administradores/${id}`);
  }

  createRol(rol){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/roles`,rol, {headers: headers});
  }

  readRoles(){
    return this.http.get(`${this.api}/roles`);
  }

  updateRol(rol){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.put(`${this.api}/roles/${rol.id}`,rol, {headers: headers});
  }

	deleteRol(id){
		return this.http.delete(`${this.api}/roles/${id}`,id);
	}

}
