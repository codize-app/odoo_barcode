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
  pricelists: any;
  pricelist_id = 0;
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
    private barcodeScanner: BarcodeScanner
  ) { }

  public ngOnInit(): void {
    if (Globals.uid !== '0') {
      this.odoo.uid = Globals.uid;
      this.getPricelist();
      this.loading = false;
    } else {
      this.odoo.data().subscribe((data: any) => {
        this.data = data;
        this.odoo.login().subscribe((res: any) => {
          if (res !== false) {
            Globals.uid = res;
            this.getPricelist();
            this.loading = false;
          }
        });
      });
    }
  }

  scanProduct(): void {
    this.barcodeScanner.scan({
      prompt: 'Scan Product Barcode',
      resultDisplayDuration: 0
    }).then(barcodeData => {
      this.getProduct(barcodeData.text);
    }).catch(err => {
      this.err = err;
    });
  }

  getPricelist(): void {
    this.odoo.searchRead('product.pricelist', [],
    {fields: ['name']})
    .subscribe((res: any) => {
      console.log(res);
      if (res.length > 0) {
        this.pricelist_id = res[0].id;
        this.pricelists = res;
      }
    });
  }

  getProduct(barcode: string): void {
    this.loading_product = true;
    this.product = null;
    this.err = '';

    let fields = [];

    if (this.data.server_version_info[0] <= 12) {
      fields = ['name', 'lst_price', 'image_medium', 'currency_id'];
    } else {
      fields = ['name', 'lst_price', 'image_256', 'currency_id'];
    }

    this.odoo.searchRead('product.product',
    [['barcode', '=', barcode]],
    {fields: fields})
    .subscribe((res: any) => {
      this.loading_product = false;
      if (res.length > 0) {
        this.product = {
          name: res[0].name,
          lst_price: res[0].lst_price,
          image: res[0].image_256 || res[0].image_medium,
          barcode: barcode,
          currency: res[0].currency_id[1]
        };
      } else {
        this.err = 'Product not found, N° ' + barcode;
      }
    });
  }

  logout(): void {
    this.router.navigate(['/home']);
  }

}
