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
    "descuento": null,
    "estado": null,
    "image": null
  };
  catalogoEdit = {
    "id_catalogo": null,
    "titulo": null,
    "descuento": null,
    "estado": null,
    "imagen": null
  };


  constructor(private route: Router, private http : SendHttpData) { }

  ngOnInit(): void {
    this.getCatalogos();
  }

  // Obtener catalogos.
  getCatalogos(){
    this.http.httpGet('catalogos', true).subscribe(
      response => {
        this.catalogos = response.catalogos;
      },
      error => {
        console.error(error);
      }
    );
  }

  verDetalle(){
    this.route.navigate(['/productos']);
  }

  showCatOptions(id){
    $('#'+ id + '-overblock').addClass('show-over animated fadeIn');
    $('#'+ id + '-box-catalogo ul').addClass('show-options');
  }

  closeCatOptions(id){
    $('#'+ id + '-overblock').removeClass('show-over animated fadeIn');
    $('#'+ id + '-box-catalogo ul').removeClass('show-options');
  }
  hideActions(id){
    $('.overblock').removeClass('show-over');
    // $('.show-options').removeClass('show-options');
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

  onSelect(event) {
    this.files = event.addedFiles;
    this.readFile(this.files[0]).then(fileContents => {
      this.catalogo.image = fileContents;
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
      "estado": null,
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
    this.openDrawerRigth(true, 'edit');
    this.catalogoEdit = catalogo;  
  }

}