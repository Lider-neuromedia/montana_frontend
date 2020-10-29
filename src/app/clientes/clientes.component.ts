import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { SendHttpData } from '../services/SendHttpData';
import { trigger, state, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2'
declare var $:any;


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out', 
                    style({ height: '100%', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: '100%', opacity: 1 }),
            animate('.5s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    ),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ]
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

  // Paginacion
  current: number = 1;
  itemPerPage: number = 5;

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
  }

  clientes = [];
  rol = localStorage.getItem('rol');

  removeItemsUsers = [];

  openDrawer = false;
  updateDrawer = false;

  createClient : any;
  createTiendas : any;
  vendedores : [];
  search : '';

  constructor( private clients: UsersService, private route: Router, private http: SendHttpData) {
    this.clients.getAllClients().subscribe( (data:any) => {
      this.clientes = data['users'];
    });
  }

  ngOnInit(): void {
    this.asignCreateClient();
    this.asignTiendasClient();
  }

  asignCreateClient(){
    this.createClient = {
      name : '',
      apellidos : '',
      tipo_documento : '',
      dni : '',
      email: '',
      password: '',
      nit: '',
      vendedor : {
        id: 0,
        name: '',
        apellidos: '',
        dni : ''
      },
      tiendas: []
    };
  }
  asignTiendasClient(){
    this.createTiendas = {
      nombre : '',
      lugar : '',
      local : '',
      direccion : '',
      telefono : ''
    }
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
    this.generales = true;
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
    this.credenciales = true;
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
    this.tienda = true;
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
    this.asignar = true;

    this.activeDatos = false;
    this.activeUsuario = false;
    this.activeTienda = false;
    this.asignarCliente = true;
  }

  clienteDetalle(id){
    this.route.navigate(['/users/clientes', id]);
  }

  agregarCliente(){
    this.clients.createUser(this.createClient).subscribe(
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

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  // Agregar tienda.
  addTienda(){
    // Validates.
    this.createClient.tiendas.push(this.createTiendas);
    this.asignTiendasClient();
  }

  searchVendedor(){
    var route = 'searchVendedor?search=' + this.search;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.deleteVendedorSelect();
          this.vendedores = response.vendedores;
        }
      },
      error => {

      }
    )
  }

  selectVendedor(vendedor){
    this.createClient.vendedor = vendedor;
    this.vendedores = [];
    this.search = '';
  }
  
  deleteVendedorSelect(){
    this.createClient.vendedor = {
      id: 0,
      name: '',
      apellidos: '',
      dni : ''
    };
  }

}
