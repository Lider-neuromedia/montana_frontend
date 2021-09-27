import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  // Local
  // api = 'http://127.0.0.1:8000/api';
  // web = 'http://127.0.0.1:8000';

  // Producción
  api = 'https://pruebasneuro.co/N-1010/montana_backend/public/api';
  web = 'https://pruebasneuro.co/N-1010/montana_backend/public';
  cargarClientes: boolean;
  cargarVendedores: boolean;
  cargarCliente: boolean;

  constructor( private http: HttpClient ) {}
  private refresh = new Subject<void>();
  admins:any = {};
  
  /* Traer todos los usuarios */
  /*getAllUsers(){
    return this.http.get('http://127.0.0.1:8000/api/usersAll');
  }*/

  get refresh$(){
    return this.refresh;
  }

  getAllUsers(i: number){
    console.log(i)
    return this.http.get(`${this.api}/users?page=${i}`);
  }

  /* Traer todos los roles */
  getRoles(){
    const headers = new HttpHeaders( {'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.api}/roles`, {headers: headers});
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
    return this.http.post(`${this.api}/users`, user, {headers: headers}).pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  updateUser(user){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.post(`${this.api}/update-user`, user, {headers: headers}).pipe(
      tap(() => {
        this.refresh$.next();
      })
    );
  }

  /* Eliminar un usuario */
  deleteUser(users){
    return this.http.delete(`${this.api}/users/${users}`, users);
  }

  /* Eliminar varios usuario */
  deleteUsers(users){
    console.log(users);
    const headers = new HttpHeaders( {'Content-Type': 'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.post(`${this.api}/delete-users`, users,{ headers:headers }).pipe(tap(() => {
      this.refresh$.next();
    }));
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
    if(this.cargarVendedores){
      return of([]);
    }
    this.cargarVendedores = true;
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    var route = 'vendedores?search=' + search;
    let users = [];
    return this.http.get(`${this.api}/` + route, {headers: headers}).pipe(tap(() => this.cargarVendedores = false));
  }
  getAllSellersForTable(search){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    var route = 'vendedores?search=' + search;
    let users = [];
    return this.http.get(`${this.api}/` + route, {headers: headers}).pipe( map((resp: any[]) => {
      resp['users'].forEach(element =>{
        users.push({
          nombre: element['name'],
          apellido: element['apellidos'],
          email: element['email'],
          iniciales: element['iniciales'],
          telefono: element['user_data'][0].value_key,
          codigo: element['user_data'][1].value_key
        });
      });        
      // console.log(resp);
      return users;
    }));
  }

  getSeller(id){
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    return this.http.get(`${this.api}/vendedor/${id}`, {headers: headers});
  }

  getAllClients(search){
    if(this.cargarClientes){
      return of([]);
    }
    this.cargarClientes = true;
    const headers = new HttpHeaders( {'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    var route = 'clientes?search=' + search;
    return this.http.get(`${this.api}/` + route, {headers: headers}).pipe(tap(() => this.cargarClientes = false));
  }
  getNameAllClients(search){
    const headers = new HttpHeaders( 
    {'Content-Type':'application/json',
     'Authorization':'Bearer ' + localStorage.getItem('access_token')
    });
    var route = 'clientes?search=' + search;
    let users = [];
    return this.http.get(`${this.api}/` + route, {headers: headers}).pipe( map( (resp: any[]) => {
      resp['users'].forEach(element => {
        users.push(`${element['name']} ${element['apellidos']}`);
      });
      return users;
    }))
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