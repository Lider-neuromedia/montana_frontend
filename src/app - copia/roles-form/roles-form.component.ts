import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { UsersService } from '../services/users.service'

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.css']
})
export class RolesFormComponent implements OnInit {

  rol = {
    "name": null,
    "guard_name": "web",
    "updated_at": null,
    "created_at": null,
  }
  roles = [];
  id:any;
	editar:boolean = false;

  constructor(private service: UsersService, private route: Router, private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.params['id'];
    console.log(this.id)
		if(this.id){
			this.editar = true;
			this.service.readRoles().subscribe( (response:any) =>{
        this.roles = response;
				this.rol = this.roles.find( (data) => {
          console.log(this.id);
					return data.id == this.id;
				})
			})
		} else {
			this.editar = false;
			console.log('No hay datos');
		}
  }

  ngOnInit(): void {
  }

  updateCountry(){
		if(this.editar){
			this.service.updateRol(this.rol).subscribe( (response) =>{
        alert('Dato actualizado');
        this.route.navigate(['/roles']);
			})
		}
	}

}
