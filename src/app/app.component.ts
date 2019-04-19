import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { timer } from 'rxjs';

declare var jquery: any;
declare var $: any;
declare var navigator: any;
declare var window: any;
declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('logged', [
      state('inactive', style({
        left: '50%'
      })),
      state('active',   style({
        left: '-100%'
      })),
      transition('inactive => active', [
        animate(500, keyframes([
          style({position: 'static', left: '0', offset: 0}),
          style({position: 'absolute', left: '50%', offset: 0.01}),
          style({position: 'absolute', left: '55%', offset: 0.2}),
          style({position: 'absolute', left: '55%', offset: 0.4}),
          style({position: 'absolute', left: '-100%', offset: 0.99}),
          style({position: 'static', left: '0', offset: 1.0}),
        ]))
      ]),
      transition('active => inactive', animate('500ms ease-in-out'))
    ])
  ]
})

export class AppComponent implements OnInit {
  public title = 'barcode';
  ////////////////////////////
  @ViewChild('form') form: ElementRef;
  public server = '';
  public db = '';
  public user = '';
  public pass = '';
  public uid = 0;
  ////////////////////////////
  public odoo_url_value = '';
  public odoo_db_value = '';
  public odoo_user_value = '';
  public odoo_pass_value = '';
  ////////////////////////////
  public logState = 'inactive';
  ////////////////////////////
  public showData = false;
  public logged = false;
  public inLoad = true;

  constructor(private renderer: Renderer2) {}

  public ngOnInit(): void {
    this.renderer.listen('document', 'deviceready', () => {
      console.log('Device is Ready');
    });

    this.logData();
  }

  public logData(): void {
    this.odoo_url_value = window.localStorage.getItem('url');
    this.odoo_db_value = window.localStorage.getItem('db');
    this.odoo_user_value = window.localStorage.getItem('user');
    this.odoo_pass_value = window.localStorage.getItem('pass');
  }

  public logIn(e: any): void {
    e.preventDefault();
    console.log('Data Readed');
    console.log('Server: ', this.form.nativeElement.elements['server'].value);
    console.log('DB: ', this.form.nativeElement.elements['db'].value);
    console.log('User: ', this.form.nativeElement.elements['user'].value);
    console.log('Pass: ', this.form.nativeElement.elements['pass'].value);

    this.server = this.form.nativeElement.elements['server'].value + '/xmlrpc';
    this.db = this.form.nativeElement.elements['db'].value;
    this.user = this.form.nativeElement.elements['user'].value;
    this.pass = this.form.nativeElement.elements['pass'].value;

    window.localStorage.setItem('url', this.form.nativeElement.elements['server'].value);
    window.localStorage.setItem('db', this.form.nativeElement.elements['db'].value);
    window.localStorage.setItem('user', this.form.nativeElement.elements['user'].value);
    window.localStorage.setItem('pass', this.form.nativeElement.elements['pass'].value);

    ////////////////////////////////////////////////////////////////////////

    const this_ = this;

    this.logState = 'active';

    const secondsCounter = timer(300);

    secondsCounter.subscribe( () => {
      this_.showData = true;
      this.odooConnect(this.server, this.db, this.user, this.pass);
    });
  }

  public odooConnect(server: string, db: string, user: string, pass: string): void {
    const this_ = this;
    this.logged = false;
    const forcedUserValue = $.xmlrpc.force('string', user);
    const forcedPasswordValue = $.xmlrpc.force('string', pass);
    const forcedDbNameValue = $.xmlrpc.force('string', db);

    $.xmlrpc({
      url: this_.server + '/common',
      methodName: 'login',
      dataType: 'xmlrpc',
      crossDomain: true,
      params: [forcedDbNameValue, forcedUserValue, forcedPasswordValue],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response + ' - ' + status);
        if (response[0] !== false) {
          this_.logged = true;
          this_.uid = response[0];
        } else {
          this_.logOut();
        }
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Err: ' + jqXHR + ' - ' + status + '-' + error);
        this_.logOut();
      }
    });
  }

  public logOut(): void {
    this.showData = false;
    this.inLoad = true;
    this.logged = false;
    this.logState = 'inactive';
  }
}
