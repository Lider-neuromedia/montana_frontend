import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { UsersService } from '../services/users.service';
import { FormControl } from "@angular/forms";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SendHttpData } from '../services/SendHttpData';
import { trigger, state, style, animate, transition } from '@angular/animations';


import Swal from 'sweetalert2'
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
export class VendedoresComponent implements OnInit {

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
    id: null,
    rol_id: 2,
    name: null,
    apellidos: null,
    dni: null,
    email: null,
    password: null,
    confirm_password: null,
    clientes: [],
    /* datos modelo usuario */
    userdata: {
      telefono: null,
      codigo: null,
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

  

  constructor( private sellers: UsersService, private route: Router, private userService: UsersService, private fb: FormBuilder, private http : SendHttpData) {

  }

  ngOnInit(): void {
    this.getVendedores();
  }
  
  getVendedores(search = ''){
    this.sellers.getAllSellers(search).subscribe(
      data =>{
      this.vendedores = data['users'];
    });
  }

  searchTable(event){
    this.getVendedores(event.target.value);
  }

  onSubmit(){
    if(this.angForm.valid) {
      // console.log(this.angForm.value);
      console.log(this.angForm);
      // this.angForm = this.fb.group({
      //   nombres: ["", Validators.required]
      // });
    } else {
      // alert("FILL ALL FIELDS");
      console.log(this.angForm);
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
        }
      },
      (error) =>{
        this.errors.name = error.error.errors.name;
        this.errors.email = error.error.errors.email;
        this.errors.password = error.error.errors.password;
      });
  }

  openDrawerRigth(action : boolean, type : string){
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
      title: 'Está seguro que desea eleiminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        var usuarios = [];
        this.checkVendedor.forEach(element => {
          usuarios.push(element.id);
        });
        var data = {usuarios : usuarios};
        
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
    if (this.vendedor.clientes.includes(cliente) === false) this.vendedor.clientes.push(cliente);
  }

  // Eliminar clientes asignados.
  deleteClientSelect(cliente){
    let removeIndex = this.vendedor.clientes.findIndex(x => x.id === cliente.id);
    if (removeIndex !== -1){
      this.vendedor.clientes.splice(removeIndex, 1);
    }
  }
  
  selectVendCheckbox(event, vendedor){
    if (event.target.checked) {
      this.checkVendedor.push(vendedor);
    }else{
      let removeIndex = this.checkVendedor.findIndex(x => x.id === vendedor.id);
      if (removeIndex !== -1){
        this.checkVendedor.splice(removeIndex, 1);
      }
    }
  }

  editTienda(){
    if (this.checkVendedor.length > 1 || this.checkVendedor.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar alguna cliente o tener solo 1 seleccionado.',
        'warning'
        );
    }else{
      this.openDrawerRigth(true, 'edit');
      this.http.httpGet('vendedor/' + this.checkVendedor[0]['id'], true).subscribe(
        response => {
          this.selectVendedor = response;
        }, 
        error => {

        }
      )
    }
  }

  actualizarVendedor(){
    this.http.httpPost('update-vendedor/' + this.selectVendedor.id, this.selectVendedor, true).subscribe(
      response =>{  
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            'Completado',
            'Vendedor actualizado de manera correcta.',
            'success'
          );
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

    var route = 'updateAsignClient/' + cliente.id + '/' + this.selectVendedor.id+ '/create';

    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          if (this.selectVendedor.clientes.includes(cliente) === false) this.selectVendedor.clientes.push(cliente);
          this.clientes = [];
        }
      },
      error => {

      }
    );
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
