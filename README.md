# Odoo Barcode

App for scan barcode with mobile and send it to Odoo Server, Android and iOS. Develop by [Codize](https://www.codize.ar).

Develop with Angular and Capacitor.

Developer: Ignacio Buioli

## Settings

Enable CORs with a Proxy like NGINX or Apache in your Odoo Server.

In order to start the project, first `npm install`

Then build the Angular App:

```
npm run build
```

Then go to Android Studio Project:

```
npx cap open android
```

Compile the APK like any other app. Install the app on device, put odoo data and log in.

## Devices Testing

* LG LM-X540HM - Android 10
* Huawei SCL-L03 - Android 5.1.1

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

---

Contact: info@codize.ar
