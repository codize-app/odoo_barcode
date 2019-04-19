import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { timer } from 'rxjs';

import { Product } from '../product';

declare var jquery: any;
declare var $: any;
declare var navigator: any;
declare var window: any;
declare var cordova: any;

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('server') server = '';
  // tslint:disable-next-line: no-input-rename
  @Input('db') db = '';
  // tslint:disable-next-line: no-input-rename
  @Input('user') user = '';
  // tslint:disable-next-line: no-input-rename
  @Input('pass') pass = '';
  // tslint:disable-next-line: no-input-rename
  @Input('uid') uid = 0;
  ////////////////////////////////////////////
  // tslint:disable-next-line: no-input-rename
  @Input('inLoad') inLoad = true;
  // tslint:disable-next-line: no-input-rename
  @Input('logged') logged = false;
  ////////////////////////////
  public barcode = '';
  public barcode_format = '';
  public p_scanned = '';
  public pr_scanned = '';
  public showScann = false;
  public showPPrice = false;
  public showErr = false;
  ////////////////////////////
  public products: Product[] = [];
  public selectedValue: number;

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.logged) {
      this.getProducts(this.server, this.db, this.user, this.pass, this.uid);
    }
  }

  public startScann(m: number): void {  // m: number = mode | 0 for Scann Barcode, 1 for get price
    const this_ = this;
    this.barcode = '';
    this.barcode_format = '';
    this.p_scanned = '';
    this.pr_scanned = '';
    this.showScann = false;
    this.showPPrice = false;
    this.showErr = false;

    cordova.plugins.barcodeScanner.scan(
      function (result: any) {
        this_.barcode = result.text;
        this_.barcode_format = result.format;
        console.log('We got a barcode\n' +
                    'Result: ' + result.text + '\n' +
                    'Format: ' + result.format + '\n' +
                    'Cancelled: ' + result.cancelled);
        switch (m) {
          case 0:
            this_.showScann = true;
            break;
          case 1:
            this_.getPrice();
            break;
          default:
            this_.showScann = true;
        }
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

  /**/
  public getProducts(server_url: string, db: string, user: string, pass: string, uid: number): void {
    const this_ = this;

    $.xmlrpc({
      url: server_url + '/2/object',
      methodName: 'execute_kw',
      crossDomain: true,
      params: [db, uid, pass, 'product.template', 'search_read', [ [] ], {'fields': ['name', 'id', 'barcode', 'list_price']}],
      success: function(response: any, status: any, jqXHR: any) {
        console.log(response);
        for (let i = 0; i < response[0].length; i++) {
          this_.products[i] = {value: response[0][i].id, viewValue: response[0][i].name, barcode: response[0][i].barcode,
          price: response[0][i].list_price};
        }
        console.log(this_.products);
        this_.inLoad = false;
      },
      error: function(jqXHR: any, status: any, error: any) {
        console.log('Error : ' + error );
      }
    });
  }

  /* Get Product Price */
  public getPrice(): void {
    for (let i = 0; i < this.products.length; i++) {
      if (this.barcode === this.products[i].barcode) {
        this.p_scanned = this.products[i].viewValue;
        this.pr_scanned = String(this.products[i].price);
        this.showPPrice = true;
      }
    }
  }

  /* Write Barcode on Product */
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

}
