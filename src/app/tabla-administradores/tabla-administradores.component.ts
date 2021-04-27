import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersService } from '../services/users.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

declare var $:any;

@Component({
  selector: 'app-tabla-administradores',
  templateUrl: './tabla-administradores.component.html',
  styleUrls: ['./tabla-administradores.component.css']
})
export class TablaAdministradoresComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<any>;
  selection: SelectionModel<any>;
  columns = ['select', 'Nombre', 'Celular', 'Email'];

  numRows: number;
  contador: number;
  dataEmitida: any;
  subscripcion: Subscription;

  @Output() emitirData = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UsersService){
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
      this.showAdmins();
    this.subscripcion = this.userService.refresh$.subscribe(() => {
        this.showAdmins();
        this.selection = new SelectionModel<any>(true, []);
    });
  }
  
  ngOnDestroy(): void{
    this.subscripcion.unsubscribe();
    // console.log("Observable cerrado");
  }
  showAdmins(){
    this.userService.getUsersAdmin().subscribe(
      res =>{
        this.dataSource = new MatTableDataSource<any>(res['users']);
        console.log(res);
        this.numRows = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.contador = 0;
        //this.user_data = this.userColumns = res['fields'];
      }
    );
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

  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }
  nuevoAdmin(){
    $('.nuevo-administrador').toggleClass('open');
    $('.overview').css('display', 'block');
  }
  abrirFormulario(){
    if(this.selection.selected.length > 1 || this.selection.selected.length === 0){
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar algun usuario o tener solo 1 seleccionado',
        'warning'
      );
      return;
    }
    this.emitirData.emit(this.dataEmitida);
    $('.editar-administrador').toggleClass('open');
    $('.overview2').css('display', 'block');
  }

  eliminarAdmin(){
    if(this.selection.selected.length > 1 || this.selection.selected.length === 0){
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar algun usuario o tener solo 1 seleccionado',
        'warning'
      );
      return;
    }
    Swal.fire({
      title: 'Está seguro que desea eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.value) {
        var data = {usuarios : [this.dataEmitida.id]};
        console.log(data);
        this.userService.deleteUsers(data).subscribe((data: any) =>{
          console.log(data.response);
          Swal.fire(
            'Completado',
            'Los usuarios han sido eliminados correctamente.',
            'success'
          );
        })
        console.log("Eliminar");
      }
    });
    
  }

  editarAdmin(data?: any, index?: number){
    this.contador = index+1;
    this.dataEmitida = data;
  }

}
