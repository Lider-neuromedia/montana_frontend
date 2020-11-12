import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  // Local
  api = 'http://127.0.0.1:8000/api';
  web = 'http://127.0.0.1:8000';

  // Producción
  // api = 'http://pruebasneuro.co/N-1010/montana_backend/public/api';
  // web = 'http://pruebasneuro.co/N-1010/montana_backend/public';

  constructor( private http: HttpClient ) {}

  admins:any = {};
  
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
    const headers = new HttpHeaders( {'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.api}/users-for-rol/${id}`, {headers: headers});
  }

  /* Agregar información adicional del usuario */
  setUserData(data){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/userdata`,data, {headers: headers});
  }

  getUsersAdmin(){
    const headers = new HttpHeaders( {'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.api}/admins`, {headers: headers});
  }

  getUserAdmin(id){
    return this.http.get(`${this.web}/admin/${id}`);
  }
  
  buscarAdmin(text:string){
    let AdminArr = [];
    text = text.toLowerCase();
    const headers = new HttpHeaders( {'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    this.admins = this.http.get(`${this.api}/admins`, {headers: headers}).subscribe(
      res =>{
        this.admins['fields'] = res;
        for(let admin of this.admins.fields['admins']){
          let nombre = admin.name.toLowerCase();
          if( nombre.indexOf(text) >= 0 ){
            AdminArr.push(admin);
          }
        }
      }
    )
    return AdminArr;
  }

  // searchAdmin(name){
  //   return this.http.get(`${this.web}/users-admin`,name);
  // }

  /* Crear usuario admin */
  createUser(user){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.post(`${this.api}/users`, user, {headers: headers});
  }

  updateUser(user){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.post(`${this.api}/update-user`, user, {headers: headers});
  }

  /* Eliminar un usuario */
  deleteUser(users){
    return this.http.delete(`${this.api}/users/${users}`, users);
  }

  /* Eliminar varios usuario */
  deleteUsers(users){
    const headers = new HttpHeaders( {'Content-Type': 'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.post(`${this.api}/delete-users`, users,{ headers:headers });
  }

  /* Clientes asianados */
  clientesAsignados(cliente){
    // return this.http.get(`${this.web}/relacion/${id}`);
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/asignar-cliente`, cliente,{ headers:headers });
  }

  createAdmin(admin){
    const headers = new HttpHeaders( {'Content-Type':'application/json'} );
    return this.http.post(`${this.api}/create-admin`,admin, {headers: headers});
  }

  getAllSellers(search){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    var route = 'vendedores?search=' + search;
    return this.http.get(`${this.api}/` + route, {headers: headers});
  }

  getSeller(id){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.api}/vendedor/${id}`, {headers: headers});
  }

  getAllClients(search){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    var route = 'clientes?search=' + search;
    return this.http.get(`${this.api}/` + route, {headers: headers});
  }

  getClient(id){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.api}/cliente/${id}`,{headers: headers});
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