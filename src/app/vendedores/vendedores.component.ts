import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { FormControl } from "@angular/forms";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SendHttpData } from '../services/SendHttpData';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';

import Swal from 'sweetalert2'
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare var $:any;

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css'],
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
export class VendedoresComponent implements OnInit, OnDestroy {

  generales = true;
  credenciales = false;
  asignar = false;

  activeDatos = true;
  activeUsuario = false;
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

  // vendedores = [];

  vendedor = {
    /* datos modelo usuario */
    id: '',
    rol_id: 2,
    name: '',
    apellidos: '',
    dni: '',
    email: '',
    password: '',
    confirm_password: '',
    clientes: [],
    /* datos modelo usuario */
    userdata: {
      telefono: '',
      codigo: '',
    }
  };

  datos:any = [];

  info = {
    'user_id': null,
    'field_key': null,
    'value_key': null
  };

  rol = localStorage.getItem('rol');
  tmp = localStorage.getItem('tmp_user');
  access_token = localStorage.getItem('access_token');

  buscador = '';

  errors = {
    name: null,
    apellidos: null,
    dni: null,
    telefono: null,
    email: null,
    password: null,
    confirm_password: null,
  }

  // drawer.
  openDrawer = false;
  updateDrawer = false;
  search = '';
  clientes = [];
  selectVendedor : any = [];
  checkVendedor : any = [];

  // Paginacion
  current: number = 1;
  itemPerPage: number = 5;

  vendedores:any = [];

  habilitado = true;

  angForm: FormGroup;
  asigCliente = new FormControl('');
  clients = [];
  filteredOptions: Observable<string[]>;
  columns = ['select', 'Nombre', 'Teléfono', 'Código', 'Correo'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection: SelectionModel<any>;
  dataSource: MatTableDataSource<any>;
  numRows: number;
  contador: number;
  desserts: any;
  sortedData: any;
  subscription : Subscription;

  error = {
    apellidos: 'Ingresa un apellido por favor',
    name: 'Ingresa un nombre por favor',
    confirm_password: 'Ingresa la confirmación de tu contraseña',
    dni: 'Ingresa un DNI',
    email: 'Ingresa un correo eléctronico',
    password: 'Ingresa una contraseña por favor',
    telefono: 'Ingrese un número de teléfono',
    codigo: 'Ingrese cóigo del vendedor'
  }

  apellidosBool: boolean = false;
  nameBool: boolean = false;
  confirm_passwordBool: boolean = false;
  dniBool: boolean = false;
  emaiBool: boolean = false;
  passwordBool: boolean = false;
  telefonoBool: boolean = false;
  codigoBool: boolean = false;
  dataCliente: any;
  

  constructor( private sellers: UsersService, private route: Router, private userService: UsersService, private fb: FormBuilder, private http : SendHttpData) {

  }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
    this.getVendedores();
    this.getClientes();
    setTimeout(() => {
      this.filteredOptions = this.asigCliente.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );      
      }, 2000);
      this.subscription = this.userService.refresh$.subscribe(() => {
        this.selection = new SelectionModel<any>(true, []);
      })
  }
  ngOnDestroy(): void{
    this.subscription.unsubscribe();
    // console.log("Observable cerrado");
  }
  private _filter(value: string): string[] {
    // console.log(value);
    const filterValue = value.toLowerCase();

    return this.clients.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  getClientes(){
    return this.userService.getAllClients('').subscribe(clientes => {
      let users = [];
      let i = 0;
      for (const iterator of clientes['users']) {
        users.push(`${clientes['users'][i].name} ${clientes['users'][i].apellidos}`);
        this.clients = users
        // console.log(this.clients); 
        i++;
      }
      
    });
  }
  getVendedores(search = ''){
    this.sellers.getAllSellers(search).subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data['users']);
      this.dataSource.paginator = this.paginator;
      this.numRows = this.dataSource.data.length;
      this.dataSource.sort = this.sort;
      // this.vendedor = data['users'];
    });
  }

  filtro(event: Event){
    const filtroValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValue.trim().toLowerCase();
    // console.log(this.dataSource);
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
    this.getVendedores(event.target.value);
  }

  onSubmit(){
    if(this.angForm.valid) {
      // console.log(this.angForm.value);
      // console.log(this.angForm);
      // this.angForm = this.fb.group({
      //   nombres: ["", Validators.required]
      // });
    } else {
      // alert("FILL ALL FIELDS");
      // console.log(this.angForm);
    }
  }

  datosGenerales(){
    this.generales = true;
    this.credenciales = false;
    this.asignar = false;

    this.activeDatos = true;
    this.activeUsuario = false;
    this.asignarCliente = false;
  }

  datosCredenciales(){
    this.credenciales = true;
    this.generales = false;
    this.asignar = false;
    this.activeDatos = false;
    this.activeUsuario = true;
    this.asignarCliente = false;
  }

  datosAsignar(){
    this.asignar = true;
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

  vendedorDetalle(id:number){
    this.route.navigate(['/users/vendedores', id]);
  }

  agregarVendedor(){
    // console.log(this.vendedor);
    if(this.vendedor.name === '' && this.vendedor.apellidos === '' && this.vendedor.confirm_password === '' && 
       this.vendedor.password === '' && this.vendedor.dni === '' && this.vendedor.email === '' && this.vendedor.userdata.telefono === '' &&
       this.vendedor.userdata.codigo === ''){
         this.nameBool = this.apellidosBool = this.confirm_passwordBool = this.passwordBool = this.dniBool = this.emaiBool = this.telefonoBool =
         this.codigoBool = true;
         return;
       }else if(this.vendedor.name === '' || this.vendedor.apellidos === '' || this.vendedor.confirm_password === '' || 
       this.vendedor.password === '' || this.vendedor.dni === '' || this.vendedor.email === '' || this.vendedor.userdata.telefono === '' ||
       this.vendedor.userdata.codigo === ''){
    if(this.vendedor.name === ''){
      this.nameBool = true;
      
    }else{
      this.nameBool = false;
    }
    if(this.vendedor.apellidos === ''){
      this.apellidosBool = true;
      
    }else{
      this.apellidosBool = false
    }
    if(this.vendedor.confirm_password === ''){
      this.confirm_passwordBool = true;
      
    }else{
      this.confirm_passwordBool = false;
    }
    if(this.vendedor.password === ''){
      this.passwordBool = true;
      
    }else{
      this.passwordBool = false;
    }
    if(this.vendedor.dni === ''){
      this.dniBool = true;
      
    }else{
      this.dniBool = false;
    }
    if(this.vendedor.email === ''){
      this.emaiBool = true;
      
    }else{
      this.emaiBool = false;
    }
    if(this.vendedor.userdata.telefono === ''){
      this.telefonoBool = true;
      
    }else{
      this.telefonoBool = false;
    }
    if(this.vendedor.userdata.codigo === ''){
      this.codigoBool = true;
      
    }else{
      this.codigoBool = false;
    }
    return;
    }
    if(this.vendedor.password !== this.vendedor.confirm_password){
      Swal.fire('Contraseñas incorrectas', '', 'error');
      return;
    }
    this.nameBool = this.apellidosBool = this.confirm_passwordBool = this.passwordBool = this.dniBool = this.emaiBool =
    this.telefonoBool = this.codigoBool = false;
    this.userService.createUser(this.vendedor).subscribe(
      (response : any) => {
        if (response.response == 'success' && response.status == 200) {
          this.getVendedores();
          this.openDrawerRigth(false, 'create');
          Swal.fire(
            'Completado',
            'Usuario creado de manera correcta.',
            'success'
          );
          this.vendedor = {
            /* datos modelo usuario */
            id: '',
            rol_id: 2,
            name: '',
            apellidos: '',
            dni: '',
            email: '',
            password: '',
            confirm_password: '',
            clientes: [],
            /* datos modelo usuario */
            userdata: {
              telefono: '',
              codigo: '',
            }
          };
        }
      },
      (error) =>{
        Swal.fire('Correo eléctronico existente, digite otro', '', 'warning');
      });
  }

  openDrawerRigth(action : boolean, type : string){
    $('.drawer-right').addClass('ocultar-scroll');
    if (type == 'create') {
      this.openDrawer = action;
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
      (!action) ? this.selectVendedor = [] : '';
    }
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
          usuarios.push(this.checkVendedor.id);
        var data = {usuarios : usuarios};
        if (this.selection.selected.length > 1 || this.selection.selected.length === 0) {
          Swal.fire(
            'Tienes problemas?',
            'Asegurate de seleccionar 1 usuario.',
            'warning'
            );
            // console.log(this.checkVendedor.length);
        }else{
          this.userService.deleteUsers(data).subscribe(
            (data:any) =>{
              if (data.response == 'success' && data.status == 200) {
                this.getVendedores();
                Swal.fire(
                  'Completado',
                  'Los usuarios han sido eliminados correctamente.',
                  'success'
                );
                this.checkVendedor = [];
              }else{
                this.getVendedores();
                Swal.fire(
                  '¡Ups!',
                  data.message,
                  'error'
                );
                this.checkVendedor = [];
  
              }
            }
          );
        }
        
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
      },
      (error) =>{
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error',
          text: 'Dirígete al apartado de usuario y contraseña'
        })
      })
  }

    // Change pagination
    changeListPagination(event){
      this.itemPerPage = event.target.value;
      this.current = 1;
    }
  
  // Buscar los clientes para asignar.
  searchClientes(){
    var route = 'searchClientes?search=' + this.search;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.clientes = response.clientes;
        }
      },
      error => {

      }
    )
  }

  asignCliente(cliente){

    this.userService.getAllClients('').subscribe(resp => {
      resp['users'].find(element => {
        if(element.name+' '+element.apellidos === cliente){     
          this.dataCliente = {
            id: element.id,
            name: element.name,
            apellidos: element.apellidos
          }   
        // console.log(element);
        }
      })
    })
    setTimeout(() => {
      // console.log(this.dataCliente);
      // this.searchClientes();
      if (this.vendedor.clientes.includes(cliente) === false) 
      this.vendedor.clientes.push(this.dataCliente)
      // this.getVendedores();
      // console.log(this.vendedor.clientes);
    }, 1500);
  }

  // Eliminar clientes asignados.
  deleteClientSelect(cliente){
    let removeIndex = this.vendedor.clientes.findIndex(x => x.id === cliente.id);
    if (removeIndex !== -1){
      this.vendedor.clientes.splice(removeIndex, 1);
    }
  }
  
  selectVendCheckbox(data?: any, index?: number){
    this.contador = index+1;
      this.checkVendedor = data;
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
      this.http.httpGet('vendedor/' + this.checkVendedor['id'], true).subscribe(
        response => {
          this.selectVendedor = response;
          // console.log(this.selectVendedor);
        }, 
        error => {

        }
      )
    }
  }

  actualizarVendedor(){
    // console.log(this.selectVendedor.id);
    // console.log(this.selectVendedor);
    if(this.selectVendedor.name === '' && this.selectVendedor.apellidos === '' && this.selectVendedor.confirm_password === '' && 
       this.selectVendedor.password === '' && this.selectVendedor.dni === '' && this.selectVendedor.email === '' && this.selectVendedor.userdata.telefono === '' &&
       this.selectVendedor.userdata.codigo === ''){
         this.nameBool = this.apellidosBool = this.confirm_passwordBool = this.passwordBool = this.dniBool = this.emaiBool = this.telefonoBool =
         this.codigoBool = true;
         return;
       }else if(this.selectVendedor.name === '' || this.selectVendedor.apellidos === '' || this.selectVendedor.confirm_password === '' || 
       this.selectVendedor.password === '' || this.selectVendedor.dni === '' || this.selectVendedor.email === '' || this.selectVendedor.telefono === '' ||
       this.selectVendedor.codigo === ''){
    if(this.selectVendedor.name === ''){
      this.nameBool = true;
      
    }else{
      this.nameBool = false;
    }
    if(this.selectVendedor.apellidos === ''){
      this.apellidosBool = true;
      
    }else{
      this.apellidosBool = false
    }
    if(this.selectVendedor.confirm_password === ''){
      this.confirm_passwordBool = true;
      
    }else{
      this.confirm_passwordBool = false;
    }
    if(this.selectVendedor.password === ''){
      this.passwordBool = true;
      
    }else{
      this.passwordBool = false;
    }
    if(this.selectVendedor.dni === ''){
      this.dniBool = true;
      
    }else{
      this.dniBool = false;
    }
    if(this.selectVendedor.email === ''){
      this.emaiBool = true;
      
    }else{
      this.emaiBool = false;
    }
    if(this.selectVendedor.telefono === ''){
      this.telefonoBool = true;
      
    }else{
      this.telefonoBool = false;
    }
    if(this.selectVendedor.codigo === ''){
      this.codigoBool = true;
      
    }else{
      this.codigoBool = false;
    }
    return;
    }
    if(this.selectVendedor.password !== this.selectVendedor.confirm_password){
      Swal.fire('Contraseñas incorrectas', '', 'error');
      return;
    }
    this.nameBool = this.apellidosBool = this.confirm_passwordBool = this.passwordBool = this.dniBool = this.emaiBool =
    this.telefonoBool = this.codigoBool = false;
    this.http.httpPost('update-vendedor/' + this.selectVendedor.id, this.selectVendedor, true).subscribe(
      response =>{  
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            'Completado',
            'Vendedor actualizado de manera correcta.',
            'success'
          );
          this.selection = new SelectionModel<any>(true, []);
          this.getVendedores();
          this.openDrawerRigth(false, 'edit');
          this.checkVendedor = [];
        }
      }, 
      error =>{

      }
    )
  }

  updateAsignCliente(cliente){

    
    this.userService.getAllClients('').subscribe(resp => {
      resp['users'].find(element => {
        if(element.name+' '+element.apellidos === cliente){     
          this.dataCliente = {
            id: element.id
          }   
        // console.log(element);
        }
      })
    })
    setTimeout(() => {
      // console.log(this.selectVendedor);
      var route = 'updateAsignClient/' + this.dataCliente.id + '/' + this.selectVendedor.id+ '/create';
      this.http.httpGet(route, true).subscribe(
        response => {
          if (response.response == 'success' && response.status == 200) {
            this.editTienda();
            if (this.selectVendedor.clientes.includes(cliente) === false)
            this.selectVendedor.clientes.push(this.dataCliente);
            this.clientes = [];
          }
        },error => {

        }
      )
     
    }, 1500);
  }

  deleteAsignClient(cliente){
    var idCliente = (cliente.id_cliente) ? cliente.id_cliente : cliente.id;
    var route = 'updateAsignClient/' + idCliente + '/' + this.selectVendedor.id+ '/delete';

    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          let removeIndex = this.selectVendedor.clientes.findIndex(x => x.id_cliente === cliente.id_cliente);
          if (removeIndex !== -1){
            this.selectVendedor.clientes.splice(removeIndex, 1);
          }
        }
      },
      error => {

      }
    );
    
  }

}
