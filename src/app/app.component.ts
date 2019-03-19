import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
declare var navigator: any;
declare var window: any;
declare var cordova: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
          style({left: '50%', offset: 0}),
          style({left: '55%', offset: 0.2}),
          style({left: '55%', offset: 0.4}),
          style({left: '-100%', offset: 1.0})
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
  public user = '';
  ////////////////////////////
  public logState = 'inactive';
  ////////////////////////////
  public showData = false;
  public inLoad = true;
  ////////////////////////////
  public barcode = '';
  public barcode_format = '';

  constructor() {}

  public ngOnInit(): void {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  }

  public onDeviceReady(): void {
    console.log('Device is Ready');
  }

  public startScann(): void {
    const this_ = this;
    this.barcode = '';
    this.barcode_format = '';

    cordova.plugins.barcodeScanner.scan(
      function (result) {
        this_.barcode = result.text;
        this_.barcode_format = result.format;
        console.log('We got a barcode\n' +
                    'Result: ' + result.text + '\n' +
                    'Format: ' + result.format + '\n' +
                    'Cancelled: ' + result.cancelled);
      },
      function (error) {
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

  public readOdooData(e: any): void {
    e.preventDefault();
    console.log('Data Readed');
    console.log('Server: ', this.form.nativeElement.elements['server'].value);
    console.log('DB: ', this.form.nativeElement.elements['db'].value);
    console.log('User: ', this.form.nativeElement.elements['user'].value);
    console.log('Pass: ', this.form.nativeElement.elements['pass'].value);

    this.server = this.form.nativeElement.elements['server'].value;
    this.user = this.form.nativeElement.elements['user'].value;

    ////////////////////////////////////////////////////////////////////////

    this.logState = 'active';

    const this_ = this;
    setTimeout(function() {
      this_.showData = true;
    }, 300);
  }

  public logOut() {
    this.form.nativeElement.reset();
    this.showData = false;
    this.logState = 'inactive';
  }
}
