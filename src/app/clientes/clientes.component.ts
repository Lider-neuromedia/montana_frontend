import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

import { UsersService } from '../services/users.service';

import Swal from 'sweetalert2'
declare var $:any;


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  generales = true;
  credenciales = false;
  tienda = false;
  asignar = false;

  activeDatos = true;
  activeUsuario = false;
  activeTienda = false;
  asignarCliente = false;

  templateImage = {
    "lupa": "assets/img/search.svg",
    "lapiz": "assets/img/editar.svg",
    "points": "assets/img/edit_points.svg",
    "mas": "assets/img/mas.svg",
    "ordenar": "assets/img/arrows_orden.svg",
    "dmVerde": "assets/img/iniciales_ba.svg",
    "dmAzul": "assets/img/iniciales_dm_azul.svg",
    "dmRojo": "assets/img/iniciales_dm_rojo.svg",
    "btnCerrar": "assets/img/cerrar.svg",
    "exportar": "assets/img/icons-filter/export.svg",
    "eliminar": "assets/img/icons-filter/trash.svg"
  };

  errors = {
    name: null,
    apellido: null,
    telefono: null,
    email: null,
    password: null,

    // nombres: null,
    // apellidos: null,
    // tipo_documento: null,
    // numero_documento: null,
    // celular: null,
    // codigo: null
  }

  cliente = {
    "id": null,
    "rol_id": 3,
    "name": null,
    "email": null,
    "password": null,
  };

  clientes = [];
  rol = localStorage.getItem('rol');

  info = {};

  roles = [];
  removeItemsUsers = [];

  openDrawer = false;
  updateDrawer = false;

  formCreateClient: FormGroup;

  constructor( private clients: UsersService, private route: Router) {

    this.clients.getAllClients().subscribe( (data:any) =>{

      // this.clientes = data;
      this.clientes = data['admins'];
      // this.user_data = this.userColumns = res['fields'];
      console.log(this.clientes);

      // let user_vendedor =  localStorage.getItem('userdata');
      // let dataString = user_vendedor;
      // let dataJson = JSON.parse(dataString);

      // let id = localStorage.getItem('user_id');

      // if(this.rol == this.roles[0].id){
      //   this.clients.getUserForRol(3).subscribe( (data:any) =>{
      //     console.log(data);
      //     this.clientes = data;
      //   })
      // }

      // if(this.rol == this.roles[1].id){
      //   this.clients.clientesAsignados(id).subscribe( (data:any) =>{
      //     this.clientes = data;

      //     for(var i = 0; i <= dataJson.length - 1; i++){
      //       var turnAround = dataJson[i].field_key;
      //       this.info[turnAround] = dataJson[i].value_key;
      //     }
      //     console.log(this.info);
      //   });

      // }
    })

  }

  ngOnInit(): void {
  }

  nuevoCliente(){
    $('.nuevo-cliente').toggleClass('open');
    $('.overview').css('display','block');
  }

  cerrarFormCliente(){
    $('.nuevo-cliente').toggleClass('open');
    $('.overview').css('display','none');
  }

  accionesCliente(){
    $('.acciones-cliente').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  datosGenerales(){
    this.generales = !this.generales;
    this.credenciales = false;
    this.tienda = false;
    this.asignar = false;

    this.activeDatos = true;
    this.activeUsuario = false;
    this.activeTienda = false;
    this.asignarCliente = false;
  }

  datosCredenciales(){
    this.generales = false;
    this.credenciales = !this.credenciales;
    this.tienda = false;
    this.asignar = false;

    this.activeDatos = false;
    this.activeUsuario = true;
    this.activeTienda = false;
    this.asignarCliente = false;
  }

  crearTienda(){
    this.generales = false;
    this.credenciales = false;
    this.tienda = !this.tienda;
    this.asignar = false;

    this.activeDatos = false;
    this.activeUsuario = false;
    this.activeTienda = true;
    this.asignarCliente = false;
  }

  datosAsignar(){
    this.generales = false;
    this.credenciales = false;
    this.tienda = false;
    this.asignar = !this.asignar;

    this.activeDatos = false;
    this.activeUsuario = false;
    this.activeTienda = false;
    this.asignarCliente = true;
  }

  clienteDetalle(id){
    this.route.navigate(['/users/clientes', id]);
  }

  agregarCliente(){
    this.clients.createUser(this.cliente).subscribe(
      (data:any) =>{
        console.log(data);
        let tmpUser = localStorage.setItem('tmp_user',data.tmp_user);
      },
      (error) =>{
        this.errors.name = error.error.errors.name;
        this.errors.email = error.error.errors.email;
        this.errors.password = error.error.errors.password;

        console.log( this.errors.name );
        console.log( this.errors.email );
        console.log( this.errors.password );
      });
  }

  removeUsers(id){
    this.removeItemsUsers.push(id);
    console.log( this.removeItemsUsers );
  }

  getUsersAndDelete(){

    Swal.fire({
      title: 'Está seguro que desea eleiminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Completado',
          'El usuario ha sido eliminado',
          'success'
        )
        // Método deleteUser para un sólo usuario ---- método deleteUsers para varios usuarios
        this.clients.deleteUsers(this.removeItemsUsers).subscribe( (data:any) =>{
          console.log(data);
        })
      }
    })
    
  }

  openDrawerRigth(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
    }
  }

  submitCreateUser(){
    console.log('entro');
    // var data = this.catalogo;
    // this.http.httpPost('catalogos', data, true).subscribe(
    //   response => {
    //     if (response.status == 200 && response.response == 'success') {
    //       this.openDrawer = false;
    //       this.getCatalogos();
    //       this.resetForm();
    //     }
    //   }, 
    //   error => {
    //     console.error(error);
    //   }
    // )
  }

}
