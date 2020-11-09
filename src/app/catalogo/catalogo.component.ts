import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  catalogos : any;
  openDrawer = false;
  updateDrawer = false;
  files: File[] = [];
  catalogo = {
    "nombre": null,
    "descuento": 0,
    "estado": 'activo',
    "tipo": 'general',
    "image": null
  };
  catalogoEdit = {
    "id_catalogo": null,
    "titulo": null,
    "descuento": 0,
    "estado": null,
    "tipo": null,
    "imagen": null
  };
  showEditDropzone = false;
  // Paginacion
  current: number = 1;
  itemPerPage: number = 8;
  filterCatalogo = {
    all : true,
    general : false,
    show_room : false,
    public : false,
    private : false,
  }


  constructor(private route: Router, private http : SendHttpData) { }

  ngOnInit(): void {
    this.getCatalogos();
  }

  // Obtener catalogos.
  getCatalogos(search = null){
    var route = 'catalogos';
    
    if (search != null) {
      route = 'catalogos?' + search;
    }

    this.http.httpGet(route, true).subscribe(
      response => {
        this.catalogos = response.catalogos;
      },
      error => {
        console.error(error);
      }
    );
  }

  verDetalle(id){
    this.route.navigate(['/productos/' + id]);
  }

  showCatOptions(id){
    $('#'+ id + '-overblock').addClass('show-over animated fadeIn');
    $('#'+ id + '-box-catalogo ul').addClass('show-options');
  }

  closeCatOptions(id){
    $('#'+ id + '-overblock').removeClass('show-over animated fadeIn');
    $('#'+ id + '-box-catalogo ul').removeClass('show-options');
  }


  openDrawerRight(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
      (!action) ? this.updateDrawer = false : '';
    }else{
      this.updateDrawer = action;
      (!action) ? this.openDrawer = false : '';
    }
  }

  onSelect(event, edit = false) {
    this.files = event.addedFiles;
    this.readFile(this.files[0]).then(fileContents => {
      if (edit) {
        this.catalogoEdit.imagen = fileContents;
      }else{
        this.catalogo.image = fileContents;
      }
    });
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

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  resetForm(){
    this.catalogo = {
      "nombre": null,
      "descuento": null,
      "estado": 'activo',
      "tipo": 'general',
      "image": null
    };
    this.files = [];
  }

  submitCreateCat(){
    var data = this.catalogo;
    this.http.httpPost('catalogos', data, true).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.openDrawer = false;
          this.getCatalogos();
          this.resetForm();
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  deleteCatalogo(id){
    this.http.httpDelete('catalogos', id).subscribe(
      response => {
        if (response.status == 200 && response.response == 'success') {
          this.getCatalogos();
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  editCatalogo(catalogo){
    this.openDrawerRight(true, 'edit');
    this.catalogoEdit = catalogo;  
  }

  submitUpdateCatalogo(){
    var data = this.catalogoEdit;
    this.http.httpPut('catalogos', data.id_catalogo ,data, true).subscribe(
      response => {
        console.log(response);
        if (response.status == 200 && response.response == 'success') {
          this.updateDrawer = false;
          this.getCatalogos();
          this.resetForm();
        }
      }, 
      error => {
        console.error(error);
      }
    )
  }

  showEditImageOptions(){
    $('.overblock-edit').addClass('show-over');
    $('.box-image-edit ul').addClass('show-options');
  }
  
  hideEditImageOptions(){
    $('.overblock-edit').removeClass('show-over');
    $('.box-image-edit ul').removeClass('show-options');
  }

  changeImageEdit(){ this.showEditDropzone = true; }

  // Change pagination
  changeListPagination(event){
    this.itemPerPage = event.target.value;
    this.current = 1;
  }

  accionesCatalogos(){
    $('.filtros-catalogo').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  checkFilterCatalogo(event, type){
    if (type != 'all') {
      this.filterCatalogo.all = false;
    }else{
      if (event.target.checked) {
        Object.assign(this.filterCatalogo, {all:true, general:true, show_room :true, public : true, private: true});
      }else{
        Object.assign(this.filterCatalogo, {all:false, general:false, show_room :false, public : false, private: false});
      }
    }
    var search = "search=" + JSON.stringify(this.filterCatalogo);
    this.getCatalogos(search); 
  }
}

