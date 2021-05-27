// import { stringify } from '@angular/compiler/src/util';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SendHttpData } from '../services/SendHttpData';
import { UsersService } from '../services/users.service';
import * as html2pdf from 'html2pdf.js';

declare var $:any;

@Component({
  selector: 'app-vendedor-detalle',
  templateUrl: './vendedor-detalle.component.html',
  styleUrls: ['./vendedor-detalle.component.css'],
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
export class VendedorDetalleComponent implements OnInit {

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
    "eliminar": "assets/img/icons-filter/trash.svg",
    "editar": "assets/img/editar.svg",
    "ganadas":"assets/img/ganadas.svg",
    "perdidas":"assets/img/perdidas.svg",
    "proximas":"assets/img/proximas.svg"
  };

  id:any;

  usuarios:any = {};
  info:any = {};
  iniciales: string;
  dataSource: MatTableDataSource<any>;
  asigCliente = new FormControl('');
  filteredOptions: Observable<string[]>;
  columns = ['Pedidos'];
  show = true;
  openDrawer = false;
  activeDatos = true;
  activeUsuario = false;
  asignarCliente = false;
  generales = true;
  credenciales = false;
  asignar = false;
  dataCliente: any;
  clients = [];
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

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private user: UsersService, private http : SendHttpData) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.mat-tab-body-content').addClass('scroll-desctivado');
    }, 500);
    this.getVendedor();
    this.getClientes();
    setTimeout(() => {
      this.filteredOptions = this.asigCliente.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );      
      }, 2000);
  }
  exportarPDF(){
      const options = {
        filename: `${this.usuarios.name} ${this.usuarios.apellidos}.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 3,
          letterRendering: true
        },
        jsPDF: {
          unit: 'in',
          format: 'a3',
          orientation: 'landscape'
        }
      };
    let element = document.querySelector('#vendedor');
    setTimeout(() => {
      html2pdf()
      .from(element)
      .set(options)
      .save();  
    }, 500);
    
  }
  private _filter(value: string): string[] {
    // console.log(value);
    const filterValue = value.toLowerCase();

    return this.clients.filter(option => option.toLowerCase().includes(filterValue));
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

  updateAsignCliente(cliente){

    
    this.user.getAllClients('').subscribe(resp => {
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
      // console.log(this.usuarios);
      var route = 'updateAsignClient/' + this.dataCliente.id + '/' + this.usuarios.id+ '/create';
      this.http.httpGet(route, true).subscribe(
        response => {
          if (response.response == 'success' && response.status == 200) {
            if (this.usuarios.clientes.includes(cliente) === false)
            this.usuarios.clientes.push(this.dataCliente);
          }
        },error => {

        }
      )
     
    }, 1500);
  }

  deleteAsignClient(cliente){
    var idCliente = (cliente.id_cliente) ? cliente.id_cliente : cliente.id;
    var route = 'updateAsignClient/' + idCliente + '/' + this.usuarios.id+ '/delete';

    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          let removeIndex = this.usuarios.clientes.findIndex(x => x.id_cliente === cliente.id_cliente);
          if (removeIndex !== -1){
            this.usuarios.clientes.splice(removeIndex, 1);
          }
        }
      },
      error => {

      }
    );
    
  }

  filtro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getVendedor(){

    if(this.id != null){
      this.user.getSeller(this.id).subscribe(
        (data:any) =>{
          console.log(data);
          this.usuarios = data;
          this.iniciales = data.name.charAt(0)+data.apellidos.charAt(0);
          this.dataSource = new MatTableDataSource<any>(data.pedidos);
          console.log(this.iniciales);
        },
        (error) =>{
          this.show = false;
        })
    }
  }

  getClientes(){
    return this.user.getAllClients('').subscribe(clientes => {
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

  openDrawerRigth(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
    }
  }

  actualizarVendedor(){
    if(this.usuarios.name === '' && this.usuarios.apellidos === '' && this.usuarios.confirm_password === '' && 
       this.usuarios.password === '' && this.usuarios.dni === '' && this.usuarios.email === '' && this.usuarios.userdata.telefono === '' &&
       this.usuarios.userdata.codigo === ''){
         this.nameBool = this.apellidosBool = this.confirm_passwordBool = this.passwordBool = this.dniBool = this.emaiBool = this.telefonoBool =
         this.codigoBool = true;
         return;
       }else if(this.usuarios.name === '' || this.usuarios.apellidos === '' || this.usuarios.confirm_password === '' || 
       this.usuarios.password === '' || this.usuarios.dni === '' || this.usuarios.email === '' || this.usuarios.telefono === '' ||
       this.usuarios.codigo === ''){
    if(this.usuarios.name === ''){
      this.nameBool = true;
      
    }else{
      this.nameBool = false;
    }
    if(this.usuarios.apellidos === ''){
      this.apellidosBool = true;
      
    }else{
      this.apellidosBool = false
    }
    if(this.usuarios.confirm_password === ''){
      this.confirm_passwordBool = true;
      
    }else{
      this.confirm_passwordBool = false;
    }
    if(this.usuarios.password === ''){
      this.passwordBool = true;
      
    }else{
      this.passwordBool = false;
    }
    if(this.usuarios.dni === ''){
      this.dniBool = true;
      
    }else{
      this.dniBool = false;
    }
    if(this.usuarios.email === ''){
      this.emaiBool = true;
      
    }else{
      this.emaiBool = false;
    }
    if(this.usuarios.telefono === ''){
      this.telefonoBool = true;
      
    }else{
      this.telefonoBool = false;
    }
    if(this.usuarios.codigo === ''){
      this.codigoBool = true;
      
    }else{
      this.codigoBool = false;
    }
    return;
    }
    if(this.usuarios.password !== this.usuarios.confirm_password){
      Swal.fire('Contraseñas incorrectas', '', 'error');
      return;
    }
    this.nameBool = this.apellidosBool = this.confirm_passwordBool = this.passwordBool = this.dniBool = this.emaiBool =
    this.telefonoBool = this.codigoBool = false;
    this.http.httpPost('update-vendedor/' + this.usuarios.id, this.usuarios, true).subscribe(
      response =>{  
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            'Completado',
            'Vendedor actualizado de manera correcta.',
            'success'
          );
          this.getVendedor();
          this.openDrawer = false;
        }
      }, 
      error =>{

      }
    )
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
          usuarios.push(this.usuarios.id);
        var data = {usuarios : usuarios};
        Swal.fire('Eliminando Vendedor', '', 'info');
        Swal.showLoading();
          this.user.deleteUsers(data).subscribe(
            (data:any) =>{
              if (data.response == 'success' && data.status == 200) {
                
                Swal.fire(
                  'Completado',
                  'Los usuarios han sido eliminados correctamente.',
                  'success'
                );
                this.openDrawer = false;
                this.route.navigateByUrl('/users/vendedores');
              }else{
                Swal.fire(
                  '¡Ups!',
                  data.message,
                  'error'
                );
              }
            }
          );
      }
    }) 
  }

  editarVendedor(){
    $('.editar-vendedor').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  navigatePedido(pedido){
    this.route.navigate(['/pedido-detalle/' + pedido]);
  }

}
