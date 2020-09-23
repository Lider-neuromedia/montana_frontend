import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';

@Component({
  selector: 'app-interna-catalogo',
  templateUrl: './interna-catalogo.component.html',
  styleUrls: ['./interna-catalogo.component.css']
})
export class InternaCatalogoComponent implements OnInit {

  id_catalogo : any;
  productos = [];
  openDrawer = false;
  files_1: File[] = [];
  files_2: File[] = [];
  files_3: File[] = [];
  files_4: File[] = [];
  files_5: File[] = [];
  files_6: File[] = [];
  crearProducto = {
    nombre : '',
    catalogo : '',
    codigo : '',
    referencia : '',
    stock : 0,
    marca : '',
    precio : 0,
    descripcion : '',
    imagenes : [],
  };

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private http : SendHttpData) {
    this.id_catalogo = this.activatedRoute.snapshot.params['id'];
    this.crearProducto.catalogo = this.id_catalogo;
  }

  ngOnInit(): void {
    this.getProducts();
  }
  
  openDrawerRigth(action : boolean, type : string){
    if (type == 'create') {
      this.openDrawer = action;
      // (!action) ? this.updateDrawer = false : '';
    }else{
      // this.updateDrawer = action;
      // (!action) ? this.openDrawer = false : '';
    }
  }

  getProducts(){
    var route = 'productos/' + this.id_catalogo;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.status == 200) {
          this.productos = response.productos;
        }else{
          console.error(response.message);
        }
      }, 
      error => {

      }
    );
  }

  submitCreateProduct(){
    var data = this.crearProducto;
    this.http.httpPost('productos', data, true).subscribe(
      response => {
        if (response.response == "success" && response.status == 200) {
          this.getProducts();
          this.openDrawerRigth(false, 'create');
        }
      },
      error => {

      }
    );
  }

  verProducto(id){
    this.route.navigate(['/producto-detalle/' + id]);
  }

  
  onSelect(event, edit = false, fileSelect) {
    this[fileSelect] = event.addedFiles;
    this.readFile(this[fileSelect][0]).then(fileContents => {
      if (edit) {
        // this.catalogoEdit.imagen = fileContents;
      }else{
        if (fileSelect == 'files_1') {
          this.crearProducto.imagenes.push({image : fileContents, destacada : 1});
        }else{
          this.crearProducto.imagenes.push({image : fileContents, destacada : 0});
        }
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
    this.files_1.splice(this.files_1.indexOf(event), 1);
  }

}
