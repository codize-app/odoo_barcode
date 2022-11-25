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
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';

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
    RouterModule.forRoot(appRoutes, { anchorScrolling: 'enabled' }),
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule
  ],
  providers: [
    BarcodeScanner
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
