import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido-interna',
  templateUrl: './pedido-interna.component.html',
  styleUrls: ['./pedido-interna.component.css']
})
export class PedidoInternaComponent implements OnInit {

  cantidad = 0;

  constructor() { }

  ngOnInit(): void {
  }

  menosCantidad(){
    this.cantidad--;
  }

  masCantidad(){
    this.cantidad++;
  }

}
