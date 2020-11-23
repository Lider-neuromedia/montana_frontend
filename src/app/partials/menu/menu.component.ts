import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SendHttpData } from '../../services/SendHttpData';
import Swal from 'sweetalert2'

declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  templateImage = {
    "logo": "assets/img/logo-interna.png",
    "dashboardWhite": "assets/img/icons-menu/dashboatd.svg",
    "usuarios": "assets/img/icons-menu/usuarios.svg",
    "catalogo": "assets/img/icons-menu/catalogo.svg",
    "encuestas": "assets/img/icons-menu/encuestas.svg",
    "pedidos": "assets/img/icons-menu/pedidos.svg",
    "ampliacion": "assets/img/icons-menu/ampliacion.svg",
    "pqrs": "assets/img/icons-menu/pqrs.svg",
    "descuento": "assets/img/icons-menu/descuentos.svg",
    "auditoria": "",
    "show": "assets/img/icons-menu/showroom.svg"
  }

  rol:any;

  roles = [];

  admin:any = false;
  vendedor:any =  false;
  cliente:any = false;
  code : string = '';
  pedido_descuento = {
    id_pedido: '',
    code : this.code,
    descuento : 0,
    cliente : '',
    vendedor: ''
  }

  constructor( private users: UsersService, private http : SendHttpData ) {

    this.rol = localStorage.getItem('rol');

    this.users.getRoles().subscribe( (data:any) =>{
      this.roles = data;

      if( this.rol == this.roles[2].id){
        this.admin = false;
        this.vendedor = false;
        this.cliente = true;
      } else if( this.rol == this.roles[1].id){
        this.admin = false;
        this.vendedor = true;
        this.cliente = false;
      } else if( this.rol == this.roles[0].id ){
        this.admin = true;
        this.vendedor = true;
        this.cliente = false;
      } else {
        alert('Hubo un error');
      }

    })

  }

  ngOnInit(): void {
  }

  previewChildMenu(){
    $('.child-menu').addClass('preview-child-menu');
  }

  hideChildMenu(){
    $('.child-menu').removeClass('preview-child-menu');
  }

  showChildMenu(){
    $('.child-menu').toggleClass('show-child-menu');
  }


  getPedido(){
    this.http.httpGet('getPedidoWithCode/' + this.code, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.pedido_descuento.id_pedido = response.pedido.id_pedido;
          this.pedido_descuento.cliente = response.pedido.name_cliente + ' ' + response.pedido.apellido_cliente;
          this.pedido_descuento.vendedor = response.pedido.name_vendedor + ' ' + response.pedido.apellido_vendedor;
          this.pedido_descuento.descuento = response.pedido.descuento;
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
        }
      },
      error => {

      }
    )
  }

  setPedido(){
    var route = 'changeDescuentoPedido/' + this.pedido_descuento.id_pedido + '/' + this.pedido_descuento.descuento;
    this.http.httpGet(route, true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          Swal.fire(
            '¡Listo!',
            'Descuento asignado de manera correcta.',
            'success'
          );
          this.pedido_descuento = {
            id_pedido: '',
            code : this.code,
            descuento : 0,
            cliente : '',
            vendedor: ''
          };
          $('#descuento').modal('hide');
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
        }
      },
      error => {

      }
    )
  }

}
