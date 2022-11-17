import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LOCALE_ID } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment'; 
import localeCa from '@angular/common/locales/ca';
import localeCaExtra from '@angular/common/locales/extra/ca';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeCa, 'ca',localeCaExtra);
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([{provide: LOCALE_ID, useValue: 'ca'}]).bootstrapModule(AppModule 
, {
  providers: [{provide: LOCALE_ID, useValue: 'ca' }]
})
  .catch(err => console.log(err));
