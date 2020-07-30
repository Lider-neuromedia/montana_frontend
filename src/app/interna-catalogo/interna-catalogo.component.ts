import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

@Component({
  selector: 'app-interna-catalogo',
  templateUrl: './interna-catalogo.component.html',
  styleUrls: ['./interna-catalogo.component.css']
})
export class InternaCatalogoComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  verProducto(){
    this.route.navigate(['/producto-detalle']);
  }

}
