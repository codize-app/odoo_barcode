import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/es-AR';
import localeExtra from '@angular/common/locales/extra/es-AR';

registerLocaleData(locale, 'es-AR', localeExtra);

/*NgMaterial*/
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

/*MyComponents*/
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ScannerComponent } from './scanner/scanner.component';

/* Routes */
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'scanner', component: ScannerComponent },
  // GENERAL
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ScannerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(appRoutes, { anchorScrolling: 'enabled', relativeLinkResolution: 'legacy' }),
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  providers: [
    BarcodeScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
