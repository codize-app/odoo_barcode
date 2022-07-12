import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { OdooConnector } from '../services/ng-odoo-connect/odoo-connector.service';
import { Product } from '../product';
import { Globals } from '../app.const';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
  loading = true;
  loading_product = false;
  product: Product;
  data: any;
  local = Globals.local;
  err = '';
  odoo = new OdooConnector(
    Globals.URL,
    Globals.DB,
    Globals.USER,
    Globals.PASS,
    Globals.uid
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private barcodeScanner: BarcodeScanner) { }

  public ngOnInit(): void {
    if (Globals.uid !== '0') {
      this.odoo.uid = Globals.uid;
      this.loading = false;
    } else {
      this.odoo.data().subscribe((data: any) => {
        this.data = data;
        this.odoo.login().subscribe((res: any) => {
          if (res !== false) {
            Globals.uid = res;
            console.log(Globals.uid);
            this.loading = false;
          }
        });
      });
    }
  }

  scanProduct(): void {
    this.barcodeScanner.scan().then(barcodeData => {
      this.getProduct(barcodeData.text);
    }).catch(err => {
      alert(err);
    });
  }

  getProduct(barcode: string): void {
    this.loading_product = true;
    this.product = null;
    this.err = '';

    let fields = [];

    if (this.data.server_version_info[0] <= 12) {
      fields = ['name', 'lst_price', 'image_medium', 'barcode', 'currency_id'];
    } else {
      fields = ['name', 'lst_price', 'image_256', 'barcode', 'currency_id'];
    }

    this.odoo.searchRead('product.product',
    [['barcode', '=', barcode]],
    {fields: fields})
    .subscribe((res: any) => {
      this.loading_product = false;
      console.log(res);
      if (res.length > 0) {
        this.product = {
          name: res[0].name,
          lst_price: res[0].lst_price,
          image: res[0].image_256 || res[0].image_medium,
          barcode: res[0].barcode,
          currency: res[0].currency_id[1]
        };
      } else {
        this.err = 'Product not found';
      }
    });
  }

}
