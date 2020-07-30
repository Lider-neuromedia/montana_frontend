import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  pedidoInterna(){
    this.route.navigate(['/pedido-interna']);
  }

}
