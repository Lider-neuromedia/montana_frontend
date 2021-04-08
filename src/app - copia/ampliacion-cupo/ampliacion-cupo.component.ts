import { Component, OnInit } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import Swal from 'sweetalert2';
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

  constructor( private http : SendHttpData) {  }

  ngOnInit(): void {
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
        }
      },
      error => {

      }
    )
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
        this[variable][file] = fileContents;
      });
    }else{
      this.name_files[file] = '';
    }
  }

  submitSolicitud(){
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

  checkBoxSolicitud(event, solicitud){
    if (event.target.checked) {
      this.checkSolicitud.push(solicitud);
    }else{
      let removeIndex = this.checkSolicitud.findIndex(x => x.id_cupo === solicitud.id_cupo);
      if (removeIndex !== -1){
        this.checkSolicitud.splice(removeIndex, 1);
      }
    }
  }

  editarSolicitud(){
    if (this.checkSolicitud.length > 1 || this.checkSolicitud.length === 0) {
      Swal.fire(
        'Tienes problemas?',
        'Asegurate de seleccionar alguna solicitud o tener solo 1 seleccionado.',
        'warning'
        );
    }else{
      $('#editarSolicitud').modal('show');
      this.editSolicitud = this.checkSolicitud[0];
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