import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { UsersService } from '../services/users.service'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles = [];

  constructor( private service: UsersService, private route: Router ) {
    this.read()
  }

  ngOnInit(): void {
  }

  addRol(){
    this.route.navigate(['/roles-form']);
  }

  read(){
    this.service.readRoles().subscribe( (data:any) =>{
      this.roles = data;
      console.log(data);
    })
  }

  delete(id:any){
    this.service.deleteRol(id).subscribe( (data:any) =>{
      alert('El rol se ha eliminado');
			this.read();
    })
	}

}
