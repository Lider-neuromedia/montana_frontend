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

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private http : SendHttpData) {
    this.id_catalogo = this.activatedRoute.snapshot.params['id'];
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
    console.log("submit");
  }

  verProducto(){
    this.route.navigate(['/producto-detalle']);
  }


}
