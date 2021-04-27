import { Component, OnInit, ViewChild } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
declare var $:any;

@Component({
  selector: 'app-ampliacion-cupo',
  templateUrl: './ampliacion-cupo.component.html',
  styleUrls: ['./ampliacion-cupo.component.css']
})
export class AmpliacionCupoComponent implements OnInit {

  solicitudes = [];
  itemPerPage : number = 5;
  current : number = 1;
  clientes : any = [];
  vendedores : any = [];
  createSolicitud = {
    vendedor : '',
    cliente : '',
    doc_identidad : null,
    doc_rut : null,
    doc_camara_com : null,
    monto : 0,
  }

  error = {
    vendedor: 'Seleccione un vendedor',
    cliente: 'Seleccione un cliente',
    doc_identidad: 'Suba el documento de identidad',
    doc_rut: 'Suba el rut',
    doc_camara_com: 'Suba la cámara del comercio',
    monto: 'Ingrese un monto'
  }

  vendedorBool: boolean = false;
  clienteBool: boolean = false;
  doc_identidadBool: boolean = false;
  doc_rutBool: boolean = false;
  doc_camara_comBool: boolean = false;
  montoBool: boolean = false;


  name_files = { 
    doc_identidad : '',
    doc_rut : '',
    doc_camara_com : '',
  }
  selectChangeState = {
    solicitud : '',
    estado : ''
  };
  checkSolicitud = [];
  editSolicitud : any = [];
  columns = ['select', 'solicitud', 'fecha_creacion', 'monto', 'vendedor', 'estado', 'documentos'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection: SelectionModel<any>;
  numRows: number;
  contador: number;
  

  constructor( private http : SendHttpData) {  }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
    this.getSolicitudes();
    this.getUsers();
  }

  getSolicitudes(search = null){
    if (search != null) {
      var router = 'ampliacion-cupo?search=' + search;
    }else{
      var router = 'ampliacion-cupo';
    }
    this.http.httpGet(router, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.solicitudes = response.solicitudes;
          this.dataSource = new MatTableDataSource<any>(response.solicitudes);
          this.dataSource.paginator = this.paginator;
          this.numRows = this.dataSource.data.length;
          console.log(this.dataSource.data);
        }
      },
      error => {

      }
    )
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
  //Buscar encuesta 
  searchTable(event){
    this.getSolicitudes(event.target.value);
  }

  getUsers(){
    // Vendedores
    this.http.httpGet('getUserSmall/' + 2, true).subscribe(
      response => {
        if (response.response == 'success' && response.status) {
          this.vendedores = response.users;
        }
      }, error => { }
    );
    
    // Clientes
    this.http.httpGet('getUserSmall/' + 3, true).subscribe(
      response => {
        if (response.response == 'success' && response.status) {
          this.clientes = response.users;
        }
      }, error => { }
    );
    
  }

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  // Change files
  onFileChange(event, file, variable){
    this[variable][file] = event.target.files;
    if (this[variable][file]['length'] > 0) {
      this.name_files[file] = this[variable][file][0]['name'];
      this[variable][file] = this[variable][file][0];
      this.readFile(this[variable][file]).then(fileContents => { 
        // this[variable][file] = fileContents;
      });
    }else{
      this.name_files[file] = '';
    }
    console.log(this.createSolicitud.doc_camara_com);
    console.log(this.createSolicitud.doc_identidad);
    console.log(this.createSolicitud.doc_rut);
  }

  submitSolicitud(){
    if(this.createSolicitud.vendedor === '' && this.createSolicitud.cliente === '' && this.createSolicitud.doc_identidad === null &&
    this.createSolicitud.doc_rut === null && this.createSolicitud.doc_camara_com === null && this.createSolicitud.monto === 0){
      
      this.vendedorBool = this.clienteBool = this.doc_identidadBool = this.doc_rutBool = this.doc_camara_comBool = this.montoBool = true;
return;
    }else if(this.createSolicitud.vendedor === '' || this.createSolicitud.cliente === '' || this.createSolicitud.doc_identidad === null ||
    this.createSolicitud.doc_rut === null || this.createSolicitud.doc_camara_com === null || this.createSolicitud.monto === 0){
    if(this.createSolicitud.vendedor === ''){
      this.vendedorBool = true;
    }else{
      this.vendedorBool = false
    }
    if(this.createSolicitud.cliente === ''){
      this.clienteBool = true;
    }else{
      this.clienteBool = false;
    }
    if(this.createSolicitud.doc_identidad === null){
      this.doc_identidadBool = true;
    }else{
      this.doc_identidadBool = false;
    }
    if(this.createSolicitud.doc_rut === null){
      this.doc_rutBool = true;
    }else{
      this.doc_rutBool = false;
    }
    if(this.createSolicitud.doc_camara_com === null){
      this.doc_camara_comBool = true;
    }else{
      this.doc_camara_comBool = false;
    }
    if(this.createSolicitud.monto === 0){
      this.montoBool = true;
    }else{
      this.montoBool = false;
    }
    return;
  }
  console.log(this.createSolicitud);
  // const formData = new FormData();
  // formData.append('cliente', this.createSolicitud.cliente);
  // formData.append('doc_camara_com', this.createSolicitud.doc_camara_com);
  // formData.append('doc_identidad', this.createSolicitud.doc_identidad);
  // formData.append('doc_rut', this.createSolicitud.doc_rut);
  // formData.append('monto', this.createSolicitud.monto.toString());
  // formData.append('vendedor', this.createSolicitud.vendedor);

  this.vendedorBool = this.clienteBool = this.doc_identidadBool = this.doc_rutBool = this.doc_camara_comBool = this.montoBool = false;
    
    this.http.httpPost('ampliacion-cupo', this.createSolicitud, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Listo!',
            'Solicitud creada de manera correcta!.',
            'success'
          );
          $('#crearSolicitud').modal('hide');
          this.getSolicitudes();
          this.name_files = { 
            doc_identidad : '',
            doc_rut : '',
            doc_camara_com : '',
          }
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  submitUpdateSolicitud(){
    this.http.httpPut('ampliacion-cupo', this.editSolicitud.id_cupo, this.editSolicitud, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Listo!',
            'Solicitud actualizada de manera correcta!.',
            'success'
          );
          $('#editarSolicitud').modal('hide');
          this.getSolicitudes();
          this.checkSolicitud = [];
          this.name_files = { 
            doc_identidad : '',
            doc_rut : '',
            doc_camara_com : '',
          }
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
        }
      },
      error => {

      }
    )
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = e => {
        console.log((e.target as FileReader).result);
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }

  checkBoxSolicitud(data?: any, index?: number){
    this.contador = index+1;
    this.checkSolicitud = data;
  }

  editarSolicitud(){
    if (this.selection.selected.length > 1 || this.selection.selected.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar alguna solicitud o tener solo 1 seleccionado.',
        'warning'
        );
    }else{
      $('#editarSolicitud').modal('show');
      this.editSolicitud = this.checkSolicitud;
    }
  }

  setChangeState(solicitud){
    this.selectChangeState.solicitud = solicitud.id_cupo;
    this.selectChangeState.estado = solicitud.estado;
    $('#changeState').modal('show');
  }

  changeState(){
    this.http.httpGet('cambiar-estado/' + this.selectChangeState.solicitud + '/' + this.selectChangeState.estado, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Listo!',
            'Estado cambiado!.',
            'success'
          );
          $('#changeState').modal('hide');
          this.getSolicitudes();
        }
      }
    )
  }
  
  // Acciones solicitud.
  accionesEncuestas(){
    $('.acciones-solicitud').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

}