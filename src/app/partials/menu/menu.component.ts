import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

declare var jQuery:any;
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
  notAdmin:any = true;

  //admin = 11;

  constructor( private users: UsersService ) {
    // this.users.getAllAdministrators().subscribe( (data) =>{
    //   console.log(data);
    // })
    // if(this.permisos.administardor){
    //   //
    // }
    this.rol = localStorage.getItem('rol');

    if(this.rol != 1){
      this.notAdmin = false;
    }
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


}
