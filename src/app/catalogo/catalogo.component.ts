import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  verDetalle(){
    this.route.navigate(['/productos']);
  }

  showCatOptions(){
    $('.overblock').addClass('show-over');
    $('.box-catalogo .box-titulo-cantidad-opciones ul').addClass('show-options');
  }

  closeCatOptions(){
    $('.overblock').removeClass('show-over');
    $('.box-catalogo .box-titulo-cantidad-opciones ul').removeClass('show-options');
  }

}
