import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersService } from '../services/users.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DataVendedor } from '../interfaces/data-vendedor';
import { SendHttpData } from '../services/SendHttpData';

declare var $: any;

@Component({
  selector: 'app-tabla-vendedor',
  templateUrl: './tabla-vendedor.component.html',
  styleUrls: ['./tabla-vendedor.component.css']
})
export class TablaVendedorComponent implements OnInit {

  opened: boolean = false;
  formulario: string = "";
  dataSource: MatTableDataSource<any>;
  selection: SelectionModel<any>;
  numRows: number;
  asignarCliente = new FormControl('');
  columns = ['select','Nombre', 'Email', 'Codigo', 'Telefono'];
  clients = [];
  contador: number;
  dataEmitida: any;
  dataVendedor: DataVendedor = {
    id: null,
    name: '',
    clientes: [],
    apellidos: '',
    dni: 0,
    email: '',
    password: '',
    confirm_password: '',
    rol_id: 2,
    userdata: {
      codigo: 0,
      telefono: ''
    }
  };
  filteredOptions: Observable<string[]>;
  subscripcion: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private usersService: UsersService, private http: SendHttpData) { }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
    this.maximoAlto();
    this.getVendedor();
    this.getClientes();
    this.subscripcion = this.usersService.refresh$.subscribe(() =>{
      this.getVendedor();
    })
    
    setTimeout(() => {
    this.filteredOptions = this.asignarCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );      
    }, 2000);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.clients.filter(option => option.toLowerCase().includes(filterValue));
  }

  getClientes(){
    return this.usersService.getNameAllClients('').subscribe(clientes => {
      this.clients = clientes;
    });
  }

  getVendedor(search = ''){
    this.usersService.getAllSellers(search).subscribe(resp => {
      // console.log(resp['users']);
      this.dataSource = new MatTableDataSource<any>(resp['users']);
      this.numRows = this.dataSource.data.length;
      this.dataSource.paginator = this.paginator;
    });
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
  filtro(event: Event){
    const filtroValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValue.trim().toLowerCase();
  }


  nuevoVendedor(){
    this.opened = !this.opened;
    this.formulario = "Nuevo Vendedor"

  }

  crearVendedor(){
    let fecha = new Date().getFullYear()+"/"+new Date().getMonth()+"/"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    // console.log(this.dataVendedor);
    this.usersService.createUser(this.dataVendedor).subscribe((resp: any) => {
      if (resp.response == 'success' && resp.status == 200) {
        Swal.fire(
          'Completado',
          'Usuario creado de manera correcta.',
          'success'
        );
      }
    });
  }

  actualizarVendedor(){
    this.usersService.updateUser(this.dataVendedor).subscribe(
      (data:any) =>{
        // this.getVendedor();
        this.dataEmitida.reset();
        Swal.fire({
          icon: 'success',
          title: 'Se ha actualizado correctamente'
        });
        this.opened = !this.opened;
        // this.buscarAdmin();
      },
      (error:any) =>{
        console.log(error);
      }
    );
    // this.http.httpPost('update-vendedor/' + this.dataVendedor.id, this.dataVendedor, true).subscribe(console.log);
  }
  cargarDatos(){
    this.opened = !this.opened;
    this.dataVendedor = {
      id: this.dataEmitida.id,
      clientes: [],
      name: this.dataEmitida.name,
      apellidos: this.dataEmitida.apellidos,
      pedidos: [],
      password: this.dataEmitida.password,
      dni: this.dataEmitida.dni,
      email_verified_at: null,
      email: this.dataEmitida.email,
      rol_id: this.dataEmitida.rol_id,
      user_data: this.dataEmitida.user_data
    }
    // this.dataVendedor.userdata.telefono = this.dataEmitida.user_data[0].value_key;
    // this.dataVendedor.userdata.codigo = this.dataEmitida.user_data[1].value_key;
    console.log(this.dataVendedor);
    
  }

  editarVendedor(data?: any, index?: number){
    this.contador = index+1;
    this.dataEmitida = data;
  }

  eliminarVendedor(){
    console.log("Eliminar");
  }

  accionesVendedor(){
    $('.acciones-vendedor').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  maximoAlto(){
    var height = window.screen.height;
    $("mat-sidenav-content").css("height", height);
  }

}
