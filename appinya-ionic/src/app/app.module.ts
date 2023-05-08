/**
 *  Appinya Open Source Project
 *  Copyright (C) 2022  Daniel Horta Vidal
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as
 *   published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/

/* Angular */
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* ionic */
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from "@ionic/storage";
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
/* PrimeNg */
import { SharedModule } from "primeng/api";
import { ChartModule } from "primeng/chart";
import { CalendarModule } from "primeng/calendar";
import { EditorModule } from "primeng/editor";
import { ToggleButtonModule } from "primeng/togglebutton";


import {
  HttpClientJsonpModule,
  HttpClientModule,
  HTTP_INTERCEPTORS,

} from "@angular/common/http";
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es')
import { ErrorIntercept } from './interceptors/error.interceptor';
import { HttpIntercept } from './interceptors/http.interceptor';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { CompartitModule } from './compartit/compartit.module';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { BiometricWrapper } from '@awesome-cordova-plugins/biometric-wrapper/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CompartitModule, /* Internal Package */
    OrganizationChartModule,  /* Internal Package */
    HttpClientJsonpModule,
    FormsModule,
    GoogleMapsModule,
    CalendarModule, /* PrimeNg */
    ChartModule,    /* PrimeNg */
    EditorModule,   /* PrimeNg */
    SharedModule,   /* PrimeNg */
    ToggleButtonModule, /* PrimeNg */
    FullCalendarModule, /* Full calendar */
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    IonicStorageModule.forRoot({
      name: "appinya",
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es' },
    {
      // processes all errors
      provide: ErrorHandler,
      useClass: ErrorIntercept,
    },
    Camera, /* Native Providers */
    StatusBar, /* Native Providers */
    SplashScreen,/* Native Providers */
    AppVersion,/* Native Providers */
    BiometricWrapper,/* Native Providers */
    GooglePlus,/* Native Providers */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercept,
      multi: true, // multiple interceptors are possible
    },

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
