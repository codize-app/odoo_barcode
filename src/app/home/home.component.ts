import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Globals } from '../app.const';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  globals: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.globals = Globals;
  }

  logIn(e: any): void {
    Globals.URL = this.globals.URL;
    Globals.DB = this.globals.DB;
    Globals.USER = this.globals.USER;
    Globals.PASS = this.globals.PASS;
    ///////////////////////////
    window.localStorage.setItem('url', this.globals.URL);
    window.localStorage.setItem('db', this.globals.DB);
    window.localStorage.setItem('user', this.globals.USER);
    window.localStorage.setItem('pass', this.globals.PASS);
    ///////////////////////////
    this.router.navigate(['/scanner']);
  }

}
