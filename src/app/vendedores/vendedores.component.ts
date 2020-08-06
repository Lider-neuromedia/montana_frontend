import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

import { UsersService } from '../services/users.service';

import Swal from 'sweetalert2'
declare var $:any;

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css']
})
export class VendedoresComponent implements OnInit {

  generales = false;
  credenciales = true;
  asignar = false;

  activeDatos = false;
  activeUsuario = true;
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

  vendedores = [];

  vendedor = {
    /* datos modelo usuario */
    "id": null,
    "rol_id": 2,
    "name": null,
    "email": null,
    "password": null,
    /* datos modelo usuario */
    "userdata": {
      "apellido": null,
      "telefono": null,
    }
  };

  masDatos = {
    // "user_id": parseInt(this.tmp),
    "nombres": null,
    "apellidos": null,
    "tipo_documento": null,
    "numero_documento": null,
    "celular": null,
    "codigo": null
  }

  datos:any = [];
  info = {
    'user_id': null,
    'field_key': null,
    'value_key': null
  };

  rol = localStorage.getItem('rol');
  tmp = localStorage.getItem('tmp_user');

  buscador = '';

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

  errorsDos = {
    nombres: null,
    apellidos: null,
    tipo_documento: null,
    numero_documento: null,
    celular: null,
    codigo: null
  }

  options:any = [];
  removeItemsUsers = [];

  habilitado = true;

  

  constructor( private sellers: UsersService, private route: Router, private userService: UsersService) {
    let id = localStorage.getItem('user_id');
    this.traerVendedores();

    this.sellers.getAllClients().subscribe( (data:any) =>{
      this.options = data;
      // console.log( this.options );
    })
    
  }

  ngOnInit(): void {
  }

  datosGenerales(){
    this.generales = !this.generales;
    this.credenciales = false;
    this.asignar = false;
    this.activeDatos = true;
    this.activeUsuario = false;
    this.asignarCliente = false;
  }

  datosCredenciales(){
    this.credenciales = !this.credenciales;
    this.generales = false;
    this.asignar = false;
    this.activeDatos = false;
    this.activeUsuario = true;
    this.asignarCliente = false;
  }

  datosAsignar(){
    this.asignar = !this.asignar;
    this.credenciales = false;
    this.generales = false;
    this.activeDatos = false;
    this.activeUsuario = false;
    this.asignarCliente = true;
  }

  nuevoVendedor(){
    $('.nuevo-vendedor').toggleClass('open');
    $('.overview').css('display','block');
  }

  cerrarFormVendedor(){
    $('.nuevo-vendedor').toggleClass('open');
    $('.overview').css('display','none');
  }

  accionesVendedor(){
    $('.acciones-vendedor').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  traerVendedores(){
    this.sellers.getUserForRol(2).subscribe( (data:any) =>{
      this.vendedores = data;
    });
  }

  removeUsers(id){
    this.removeItemsUsers.push(id);
    console.log( this.removeItemsUsers );
  }

  vendedorDetalle(id){
    this.route.navigate(['/users/vendedores',id]);
  }

  agregarVendedor(){
    this.userService.createUser(this.vendedor).subscribe(
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

  agregarMasDatos(){

    this.datos = this.masDatos;
    var objeto = [];

    for (const key in this.masDatos) {
      if (this.masDatos.hasOwnProperty(key)) {
        // console.log(key + " -> " + masDatos[key]);
        objeto.push({
            user_id: this.tmp,
            field_key : key,
            value : this.masDatos[key]
        });
      }
    }

    // console.log( objeto );

    this.userService.setUserData(objeto).subscribe(
      (data) =>{
        console.log(data);
        this.traerVendedores();
      },
      (error) =>{
        console.log(error);
        // this.errorsDos.nombres = error.error.errors.nombres;
        // this.errors.apellidos = error.error.errors.apellidos;
        // this.errors.tipo_documento = error.error.errors.tipo_documento;
        // this.errors.numero_documento = error.error.errors.numero_documento;
        // this.errors.celular = error.error.errors.celular;
        // this.errors.codigo = error.error.errors.codigo;
      });

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
        this.userService.deleteUsers(this.removeItemsUsers).subscribe( (data:any) =>{
          console.log(data);
        })
      }
    })
    
  }

  cliente($event){

    let clienteID = $event.target.value;
    let datoCliente = {
      "vendedor_id": parseInt(this.tmp),
      "cliente_id": clienteID
    }

    this.userService.clientesAsignados(datoCliente).subscribe(
      (data) =>{
        Swal.fire({
          icon: 'success',
          title: 'El cliente fue asignado con éxito!',
          showConfirmButton: false,
          timer: 1500
        })
        console.log(data);
      },
      (error) =>{
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error en la asignación del cliente',
          showConfirmButton: false,
          timer: 1500
        })
      })
  }

}
