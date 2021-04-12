import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() breadcrumbs: string;
  logoutUrl = 'http://localhost/athletic-api/public/api/auth/logout';
  apiUrl = 'http://localhost/athletic-api/public/api';
  options: any;

  templateImage = {
    "logout": "assets/img/icons-header/logout.svg",
    "notificacion": "assets/img/icons-header/notificacion.svg",
    "user": "assets/img/icons-header/iniciales_user.svg",
  }

  email:any;
  iniciales: string;

  constructor( private http: HttpClient, private route: Router ) {
    this.options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    };
    this.email = localStorage.getItem('user');
    this.iniciales = localStorage.getItem('user').charAt(0).toUpperCase();
  }

  ngOnInit(): void {
  }

  logout() {
    const headers = new HttpHeaders( {'Authorization':'Bearer ' + localStorage.getItem('access_token')} );
    localStorage.removeItem('access_token');
    localStorage.removeItem('userdata');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    this.route.navigate(['/login']);
    return this.http.get(this.logoutUrl, {headers: headers});
  }

}
