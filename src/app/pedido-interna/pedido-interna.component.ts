import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SendHttpData } from '../services/SendHttpData';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

declare var $:any;

@Component({
  selector: 'app-pedido-interna',
  templateUrl: './pedido-interna.component.html',
  styleUrls: ['./pedido-interna.component.css']
})
export class PedidoInternaComponent implements OnInit {

  id_producto : any;
  files_1: File[] = [];
  files_2: File[] = [];
  files_3: File[] = [];
  files_4: File[] = [];
  files_5: File[] = [];
  files_6: File[] = [];
  openDrawer = false;
  producto = {
    nombre: '', 
    codigo: '',
    referencia: '',
    catalogo: '',
    descripcion: '',
    descuento: '',
    destacada: '',
    id_marca: '',
    id_producto: '',
    imagenes: [],
    iva: 0,
    marca: '',
    nombre_marca: '',
    precio: '',
    stock: 0,
    total: 0
  };
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  pedido : any; 
  tiendas = [];
  control_cantidad = 0;
  total_pedido = 0;
  list_buy_products = [];
  preguntas: any[];
  respuesta_usuario: any;
  dataSource: MatTableDataSource<any>;
  valoraciones: any;
  columns = ['valoraciones'];
  cantidad: number;
  tempStock: number;
  catalogo: string;

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private http : SendHttpData) {
    this.id_producto = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {

    if (localStorage.getItem('pedido') == null) {
      this.route.navigate(['/pedidos']);
    }else{
      this.pedido = JSON.parse(localStorage.getItem('pedido'));
      this.total_pedido = (this.pedido.total_pedido == undefined) ? 0 : this.pedido.total_pedido;
      this.getProduct();
      this.getTiendas();
      this.galleryOptions = [
        {
          width: '600px',
          height: '400px',
          thumbnailsColumns: 4,
          arrowPrevIcon: 'fa fa-chevron-left',
          arrowNextIcon: 'fa fa-chevron-right',
          imageAnimation: NgxGalleryAnimation.Slide
        },
        // max-width 800
        {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
        },
        // max-width 400
        {
          breakpoint: 400,
          preview: true,
        }
      ];
    }
  }

  getValoraciones(id: number){
    this.http.httpGet(`getValoraciones/${id}`, true).subscribe(
      resp => {
        if(resp.response === 'success' && resp.status === 200){
          this.valoraciones = resp.preguntas;
          let color = [];
          let preguntasTemp = [];
          let colorMap = [];
          let preguntaUnica = [];
          this.valoraciones.forEach(element => {
            color.push({
              id_pregunta:element.id_pregunta,
              pregunta:element.pregunta,
              respuesta:element.respuesta
            });
            preguntasTemp.push({
              id_pregunta:element.id_pregunta,
              pregunta:element.pregunta
            });
          });
          colorMap = preguntasTemp.map(item => [item.id_pregunta, item]);

        let colorMapArr = new Map(colorMap);
        
        let unicos = [...colorMapArr.values()];

        preguntaUnica = unicos;

        let i = 0;
        let arrTemp = [];
        let resultTemp = [];
        let objTemp = {};
        let cantidadId = 0;
        color.forEach((element, index) => {
          if(element.id_pregunta == preguntaUnica[i].id_pregunta){
            cantidadId++;
            resultTemp.push({
              id_pregunta: element.id_pregunta,
              respuesta: element.respuesta
            })
            if((index + 1) === color.length){
              let sumatoria = resultTemp.reduce(function(acumulador, siguienteValor){
                return {
                  id_pregunta: acumulador.id_pregunta,
                  respuesta: acumulador.respuesta + siguienteValor.respuesta
                }
              })
              objTemp = {
                id_pregunta: sumatoria.id_pregunta,
                pregunta: preguntaUnica[i].pregunta,
                respuesta: Math.round(sumatoria.respuesta / cantidadId)
              }
              arrTemp.push(objTemp);
            }
          }else{
            let sumatoria = resultTemp.reduce(function(acumulador, siguienteValor){
              return {
                id_pregunta: acumulador.id_pregunta,
                respuesta: acumulador.respuesta + siguienteValor.respuesta
              }
            })
            objTemp = {
              id_pregunta: sumatoria.id_pregunta,
              pregunta: preguntaUnica[i].pregunta,
              respuesta: Math.round(sumatoria.respuesta / cantidadId)
            }
            arrTemp.push(objTemp);
            i++;
            resultTemp = [];
            cantidadId = 0;
            if(element.id_pregunta == preguntaUnica[i].id_pregunta){
              cantidadId++;
              resultTemp.push({
                id_pregunta: element.id_pregunta,
                respuesta: element.respuesta
              })
            }
          }
          
        });
        // console.log(color);
        this.dataSource = new MatTableDataSource<any>(arrTemp);
        console.log(resultTemp);
        console.log(arrTemp);
        }
      },error => {
        console.log(error)
        ;
      }
    )
  }

  getPreguntas(id: number){
    this.http.httpGet(`getPreguntas/${id}`, true).subscribe(resp => {
      this.preguntas = resp.preguntas;
      this.respuesta_usuario = resp.respuesta_usuario;
      console.log(resp.preguntas);
    });
  }

  getProduct(){
    var route = 'producto/' + this.id_producto;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.status == 200) {
          this.producto = response.producto;
          this.tempStock = this.producto.stock;
          this.producto.imagenes.forEach( (element) => {
              this.galleryImages.push({
                small: element.image,
                medium: element.image,
                big: element.image
              })
          });
          this.catalogo = this.producto.catalogo;
          console.log(this.catalogo);
          this.getPreguntas(response.producto.catalogo);
          this.getValoraciones(response.producto.catalogo);
          
          // this.id_catalogo = this.producto.catalogo;
          // console.log(this.producto);
        }
      }, 
      error => {    }
    )
  }

  onSelect(event, edit = false, fileSelect) {
    this[fileSelect] = event.addedFiles;
    this.readFile(this[fileSelect][0]).then(fileContents => {
      if (edit) {
        // this.catalogoEdit.imagen = fileContents;
      }else{
        if (fileSelect == 'files_1') {
          this.producto.imagenes.push({image : fileContents, destacada : 1});
        }else{
          this.producto.imagenes.push({image : fileContents, destacada : 0});
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
    this.files_1.splice(this.files_1.indexOf(event), 1);
  }

  // Metodos boton acciones.
  accionesAdministrador(){
    $('.acciones-administrador').toggleClass('open-acciones');
    $('.box-editar').toggleClass('box-editar-open');
  }

  
  getTiendas(){
    this.http.httpGet('tiendas-cliente/' + this.pedido.cliente, true).subscribe(
      response => {
        response.forEach(element => {
          element.cantidad = 0;
        }); 
        this.tiendas = response;
      },
      error => { }
    );
  }

  
  sumCantidad(position){
    
    if(this.tiendas[position].cantidad <= this.producto.stock || this.tiendas[position].cantidad > this.producto.stock &&
       this.producto.stock > 0){
         if(this.tiendas[position].cantidad === this.producto.stock && this.producto.stock === 0){
           return;
         }
      this.cantidad++;
      this.producto.stock--;
      this.tiendas[position].cantidad++;
    }
  }

  resCantidad(position){
    
    if (this.tiendas[position].cantidad <= this.producto.stock || this.tiendas[position].cantidad > this.producto.stock &&
        this.producto.stock != 0) {
          if(this.tiendas[position].cantidad === 0){
            return;
          }
      this.tiendas[position].cantidad--;
      this.producto.stock++;
    }else if(this.tiendas[position].cantidad > this.producto.stock && this.producto.stock === 0){
      this.tiendas[position].cantidad--;
      this.producto.stock++;
    }
  }

  addProducto(){
    if(this.producto.stock === this.tempStock){
      Swal.fire('No se puede crear un pedido en 0', '', 'error');
      return;
    }
    var product_add = {
      id_producto : this.producto.id_producto,
      referencia : this.producto.referencia,
      total_producto : this.producto.total,
      tiendas : []
    };
    
    // Tiendas.
    this.tiendas.forEach( (element) => {
      var objet = {
        id_tienda: element.id_tiendas,
        lugar: element.lugar,
        direccion: element.direccion,
        local: element.local,
        cantidad: element.cantidad,
      }
      // Total de la factura.
      this.total_pedido = (this.producto.total * element.cantidad) + this.total_pedido;

      product_add.tiendas.push(objet);
    });

    this.list_buy_products.push(product_add);
    this.updateSesionPedido();
    this.route.navigate(['/pedido']);

  }

  updateSesionPedido(){
    // Update sesion pedido.
    var pedido = JSON.parse(localStorage.getItem('pedido'));
    pedido.productos = this.list_buy_products;
    pedido.total_pedido = this.total_pedido;
    this.pedido = pedido;
    localStorage.setItem('pedido', JSON.stringify(pedido));
  }
}
