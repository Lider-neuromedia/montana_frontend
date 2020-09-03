import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-administrador-detalle',
  templateUrl: './administrador-detalle.component.html',
  styleUrls: ['./administrador-detalle.component.css']
})
export class AdministradorDetalleComponent implements OnInit {


  administrador;

  admin:any = {};
  info:any = {};

  letra = "";

  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService) { 
    
    const id = this.activatedRoute.snapshot.params['id'];

    if(id != null){
      this.userService.getUserAdmin(id).subscribe(
        (res:any) =>{
          this.admin = res;
          for (var i = 0; i <= res.length - 1; i++){
            this.info = res[i];
          }
          this.info;
          this.letra = this.info.name.substr(0,1);
          // console.log(this.letra);
        }
      );
    }
  }

  ngOnInit(): void {
  }

}
