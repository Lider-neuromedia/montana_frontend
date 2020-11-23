import { Component, OnInit } from '@angular/core';
import { SendHttpData } from '../services/SendHttpData';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-show-room',
  templateUrl: './show-room.component.html',
  styleUrls: ['./show-room.component.css']
})
export class ShowRoomComponent implements OnInit {

  productos : any = [];

  constructor( private http : SendHttpData, private router : Router) { }

  ngOnInit(): void {
    this.getProductsShowRoom();
  }

  getProductsShowRoom(){

    this.http.httpGet('getProductsShowRoom', true).subscribe(
      response => {
        if (response.response == 'success' && response.status == 200) {
          this.productos = response.productos;
          console.log(response.productos);
        }else{
          Swal.fire(
            '¡Ups!',
            response.message,
            'error'
          );
          this.router.navigate(['catalogos']);
        }
      },
      error => {

      }
    )
  }

  pedidoInterna(id){
    this.router.navigate(['/producto-detalle', id]);
  }

}
