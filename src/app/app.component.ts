import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { timer } from 'rxjs';
declare var jquery: any;
declare var $: any;
declare var navigator: any;
declare var window: any;
declare var cordova: any;

export interface Product {
  value: number;
  viewValue: string;
}

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
  public inLoad = true;
  ////////////////////////////
  public barcode = '';
  public barcode_format = '';
  ////////////////////////////
  public products: Product[] = [];
  public selectedValue: number;

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

  public startScann(): void {
    const this_ = this;
    this.barcode = '';
    this.barcode_format = '';

    cordova.plugins.barcodeScanner.scan(
      function (result: any) {
        this_.barcode = result.text;
        this_.barcode_format = result.format;
        console.log('We got a barcode\n' +
                    'Result: ' + result.text + '\n' +
                    'Format: ' + result.format + '\n' +
                    'Cancelled: ' + result.cancelled);
      },
      function (error: any) {
        console.log('Scanning failed: ' + error);
      },
      {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : false, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt : 'Place a barcode inside the scan area', // Android
        resultDisplayDuration: 0, // Time of show
        orientation : 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
      }
   );
  }

  public getPrice(): void {
    const this_ = this;
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
          this_.getProducts(this_.server, this_.db, this_.user, this_.pass, response[0]);
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

  public getProducts(server_url: string, db: string, user: string, pass: string, uid: number): void {
    const this_ = this;

    $.xmlrpc({
      url: server_url + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'product.template', 'search_read', [ [] ], {'fields': ['name', 'id']}],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this_.products[i] = {value: response[0][i].id, viewValue: response[0][i].name};
        }
        console.log(this_.products);
        this_.inLoad = false;
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Error : ' + error );
      }
    });
  }

  public writeBarcode(pid: number): void {
    const this_ = this;
    this.inLoad = true;

    $.xmlrpc({
      url: this_.server + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [this_.db, this_.uid, this_.pass, 'product.template', 'write', [[pid], {'barcode': this_.barcode}]],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response);
        if (response[0] === true) {
          this_.inLoad = false;
        } else {
          this_.inLoad = false;
        }
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Error : ' + error );
        this_.inLoad = false;
      }
    });
  }

  public logOut(): void {
    this.showData = false;
    this.inLoad = true;
    this.logState = 'inactive';
  }
}
