import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  showOverPedido(){
    $('.overpedido').css('display','none');
  }

  nuevoPedido(){
    $('.overpedido').css('display','flex');
  }
  
  accionesPedido(){

  }

  continuarPedido(){
    this.route.navigate(['/pedido']);
  }

}
