import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { SendHttpData } from '../services/SendHttpData';
import { trigger, style, animate, transition } from '@angular/animations';
import Swal from 'sweetalert2'
import { FormGroup, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
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
export class ClientesComponent implements OnInit, OnDestroy {

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
  updateClient : any;
  createTiendas : any;
  vendedores : [];
  search = '';
  checkCliente: any = [];
  confirm_password: string;
  selectClient : any;
  dataSource: MatTableDataSource<any>;
  selection: SelectionModel<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columns = ['select', 'Nombre', 'Nit', 'Vendedor', 'Correo'];
  numRows: number;
  contador: number;
  subscripcion: Subscription;
  access_token: string;

  error = {
    direccion: 'Ingrese una dirección',
    local: 'Ingrese un local',
    lugar: 'Ingrese un lugar',
    nombre: 'Ingrese un nombre',
    apellidos: 'Ingrese un apellido',
    tipoDoc: 'Seleccione un documento',
    numDoc: 'Ingrese número documento',
    nit: 'Ingrese un nit',
    razonSocial: 'Ingrese razón social',
    direcCliente: 'Ingrese dirección cliente',
    telefonoCliente: 'Ingrese teléfono cliente',
    email: 'Ingrese correo electrónico',
    password: 'Ingrese contraseña',
    confirPassword: 'Ingrese confirmación de contraseña',
    telefono: 'Ingrese un teléfono'
  }

  direccionBool: boolean = false;
  localBool: boolean = false;
  lugarBool: boolean = false;
  nombreBool: boolean = false;
  telefonoBool: boolean = false;
  direcClienteBool: boolean = false;
  apellidoBool: boolean = false;
  tipoDocBool: boolean = false;
  numDocBool: boolean = false;
  nitBool: boolean = false;
  razonSocialBool: boolean = false;
  telefonoClienteBool: boolean = false;
  emailBool: boolean = false;
  passwordBool: boolean = false;
  confirPasswordBool: boolean = false;
  admin: boolean;
  vendedor: boolean;
  cliente: boolean;

  constructor( private clients: UsersService, private route: Router, private http: SendHttpData) {
   
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
    this.access_token = localStorage.getItem('access_token');
    this.obtenerRoles();
    this.asignCreateClient();
    this.asignUpdateClient();
    this.asignTiendasClient();
    this.getClients();
    this.subscripcion = this.clients.refresh$.subscribe(() => {
      this.selection = new SelectionModel<any>(true, []);
    })
  }
  ngOnDestroy(): void{
    this.subscripcion.unsubscribe();
    console.log("Observable cerrado");
  }

  getClients(search = ''){
    this.clients.getAllClients(search).subscribe( (data:any) => {
      this.dataSource = new MatTableDataSource<any>(data['users']);
      this.dataSource.paginator = this.paginator
      this.numRows = this.dataSource.data.length;
    });
  }
  filtro(event: Event){
      const filtroValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filtroValue.trim().toLowerCase();
  }
  isAllSelected() {
    let numSelected = this.selection.selected.length;
    return numSelected === this.numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  searchTable(event){
    this.getClients(event.target.value);
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

  asignUpdateClient(){
    this.updateClient = {
      name : '',
      apellidos : '',
      tipo_documento : '',
      dni : '',
      email: '',
      password: '',
      nit: '',
      razon_social: '',
      direccion: '',
      telefono: '',
      vendedor : {
        id: 0,
        name: '',
        apellidos: '',
        dni : ''
      },
      tiendas: [],
      data_user : []
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

  agregarCliente(form: NgForm){
    if(form.invalid){
      return Object.values(form.control).forEach(control => {
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control => control.markAsTouched());
        }else{
          control.markAsTouched();
        }
        return;
    });
  }
  if(!this.createClient.razon_social){
    this.createClient.razon_social = "";
  }
  if(!this.createClient.direccion){
    this.createClient.direccion = "";
  }
  if(!this.createClient.telefono){
    this.createClient.telefono = "";
  }
  
  // console.log(this.createClient);
  if(this.createClient.name === "" || this.createClient.apellidos === "" || this.createClient.dni === "" ||
     this.createClient.tipo_documento === "" || this.createClient.email === "" || this.createClient.password === "" ||
     this.createClient.razon_social === "" || this.createClient.direccion === "" || this.createClient.tiendas.length === 0 ||
     this.createClient.telefono === "" || this.confirm_password === "" || this.createClient.nit === ""){
       if(this.createClient.name === ""){
         this.nombreBool = true;
       }else{
         this.nombreBool = false;
       }
       if(this.createClient.apellidos === ""){
         this.apellidoBool = true;
       }else{
         this.apellidoBool = false;
       }
       if(this.createClient.dni === ""){
         this.numDocBool = true;
       }else{
         this.numDocBool = false;
       }
       if(this.createClient.tipo_documento === ""){
         this.tipoDocBool = true;
       }else{
         this.tipoDocBool = false;
       }
       if(this.createClient.email === ""){
         this.emailBool = true;
       }else{
         this.emailBool = false;
       }
       if(this.createClient.password === ""){
         this.passwordBool = true;
       }else{
         this.passwordBool = false;
       }
       if(this.confirm_password === ""){
        this.confirPasswordBool = true;
       }else{
         this.confirPasswordBool = false;
       }
       if(this.createClient.razon_social === ""){
         this.razonSocialBool = true;
       }else{
         this.razonSocialBool = false;
       }
       if(this.createClient.direccion === ""){
         this.direcClienteBool = true;
       }else{
         this.direcClienteBool = false;
       }
       if(this.createClient.nit === ""){
         this.nitBool = true;
       }else{
         this.nitBool = false;
       }
       if(this.createClient.telefono === ""){
         this.telefonoBool = true;
       }else{
         this.telefonoBool = false;
       }
       if(this.createClient.tiendas.length === 0){
         Swal.fire('Debes ingresar por lo mínimo 1 tienda', '', 'error');
       }
       return;
     }

     this.nombreBool = this.apellidoBool = this.direcClienteBool = this.numDocBool = this.tipoDocBool = this.emailBool =
     this.passwordBool = this.confirPasswordBool = this.razonSocialBool = this.direcClienteBool = false;
     
  console.log(this.createClient.password);
  console.log(this.confirm_password);
  if(this.createClient.password !== this.confirm_password){
    Swal.fire('Contraseñas incorrectas', '', 'error');
    return;
  }
    var data = {
      rol_id : 3,
      name : this.createClient.name,
      apellidos : this.createClient.apellidos,
      dni : this.createClient.dni,
      email : this.createClient.email,
      password : this.createClient.password,
      userdata : {
        nit : this.createClient.nit,
        razon_social : this.createClient.razon_social,
        direccion : this.createClient.direccion,
        telefono : this.createClient.telefono,

      }, 
      tiendas : this.createClient.tiendas,
      vendedor : this.createClient.vendedor.id
    }

    this.clients.createUser(data).subscribe(
      (response : any) => {
        if (response.response == 'success' && response.status == 200) {
          this.getClients();
          this.openDrawerRigth(false, 'create');
          this.asignCreateClient();
          this.confirm_password = "";
          Swal.fire(
            'Completado',
            'Usuario creado de manera correcta.',
            'success'
          );
          
        }
      },
      (error) =>{
      });
  }

  removeUsers(id){
    this.removeItemsUsers.push(id);
    console.log( this.removeItemsUsers );
  }

  getUsersAndDelete(){

    Swal.fire({
      title: 'Está seguro que desea eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        var usuarios = [];
        console.log(this.checkCliente);
          usuarios.push(this.checkCliente.id);
        var data = {usuarios : usuarios};
        if (this.selection.selected.length > 1 || this.selection.selected.length === 0) {
          Swal.fire(
            'Tienes problemas?',
            'Asegurate de seleccionar 1 usuario.',
            'warning'
            );
        }else{
          this.clients.deleteUsers(data).subscribe(
            (data:any) =>{
              if (data.response == 'success' && data.status == 200) {
                this.getClients();
                Swal.fire(
                  'Completado',
                  'Los usuarios han sido eliminados correctamente.',
                  'success'
                );
                this.checkCliente = [];
              }else{
                this.getClients();
                Swal.fire(
                  '¡Ups!',
                  data.message,
                  'error'
                );
                this.checkCliente = [];
              }
            }, error => {
              Swal.fire(error.error.response, error.error.message, 'error')
            }
          )
        }
        ;
      }
    })
    
  }

  openDrawerRigth(action : boolean, type : string){
    $('.acciones-form-adminitrador').toggleClass('btn-relativos');
    if (type == 'create') {
      this.openDrawer = action;
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
    }
  }

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  // Agregar tienda.
  addTienda(){
    if(this.createTiendas.direccion === "" && this.createTiendas.local === "" && this.createTiendas.lugar === "" &&
       this.createTiendas.nombre === "" && this.createTiendas.telefono === ""){
         this.direccionBool = this.localBool = this.lugarBool = this.nombreBool = this.telefonoBool = true;
         return;
       }else if(this.createTiendas.direccion === "" || this.createTiendas.local === "" || this.createTiendas.lugar === "" ||
       this.createTiendas.nombre === "" || this.createTiendas.telefono === ""){
          if(this.createTiendas.direccion === ""){
            this.direccionBool = true;
          }else{
            this.direccionBool = false;
          }
          if(this.createTiendas.local === ""){
            this.localBool = true;
          }else{
            this.localBool = false;
          }
          if(this.createTiendas.lugar === ""){
            this.lugarBool = true;
          }else{
            this.lugarBool = false;
          }
          if(this.createTiendas.nombre === ""){
            this.nombreBool = true;
          }else{
            this.nombreBool = false;
          }
          if(this.createTiendas.telefono === ""){
            this.telefonoBool = true;
          }else{
            this.telefonoBool = false;
          }
          return;
       }
       this.direccionBool = this.localBool = this.lugarBool = this.nombreBool = this.telefonoBool = false;
    this.createClient.tiendas.push(this.createTiendas);
    // console.log(this.createTiendas);
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

  selectClientCheckbox(data?: any, index?: number){
    this.contador = index+1;
      this.checkCliente = data;
  }

  editTienda(){
    if (this.selection.selected.length > 1 || this.selection.selected.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar 1 usuario.',
        'warning'
        );
    }else{
      this.openDrawerRigth(true, 'edit');
      this.selectClient = this.checkCliente;
      this.clients.getClient(this.selectClient.id).subscribe(
        (data:any) =>{
          this.updateClient = data;
        },
        (error) =>{
          
      })

    }
  }

  submitUpdateClient(){
    this.http.httpPost('update-cliente/' + this.updateClient.id, this.updateClient, true).subscribe(
      response =>{  
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            'Completado',
            'Cliente actualizado de manera correcta.',
            'success'
          );
          this.selection = new SelectionModel<any>(true, []);
          this.getClients();
          this.openDrawerRigth(false, 'edit');
        }
      }, 
      error =>{

      }
    )
  }


  updateAsignCliente(vendedor){

    var route = 'updateAsignVend/' + this.updateClient.id + '/' + vendedor.id+ '/create';

    this.http.httpGet(route, true).subscribe(
      response => {    
        this.updateClient.vendedor = vendedor;
        this.vendedores = [];
        this.search = '';
        this.getClients();
      },
      error => {

      }
    );
  }

  deleteAsignVendedor(vendedor){
    var idVendedor = (vendedor.id_vendedor) ? idVendedor = vendedor.id_vendedor : idVendedor = vendedor.id;
    var route = 'updateAsignVend/' + this.updateClient.id + '/' + idVendedor + '/delete';
    console.log(vendedor);
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.updateClient.vendedor = null;
          this.getClients();
        }
      },
      error => {

      }
    );
  }

  createTiendaUpdateClient(){
    
    var route = 'newTienda/' + this.updateClient.id;
    this.http.httpPost(route, this.createTiendas, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.updateClient.tiendas.push(this.createTiendas);
          this.asignTiendasClient();
        }
      },
      error => {

      }
    )
  }
  
  obtenerRoles(){

    this.clients.getRoles().subscribe( (data:any) =>{
      if( this.rol == data[2].id){ // Rol de clientes rol_id = 3
        this.admin = false;
        this.vendedor = false;
        this.cliente = true;
      } else if( this.rol == data[1].id){ // Rol de vendedores rol_id = 2
        this.admin = false;
        this.vendedor = true;
        this.cliente = false;
      } else if( this.rol == data[0].id ){ // Rol de adminnistrador rol_id = 1
        this.admin = true;
        this.vendedor = true;
        this.cliente = false;
      } else {
        alert('Hubo un error');
      }
    })
  }

}
