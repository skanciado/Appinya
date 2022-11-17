/**
 *  Appinya Open Source Project
 *  Copyright (C) 2019  Daniel Horta Vidal
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
import { ErrorHandler, Injectable, NgModule } from "@angular/core";
import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import {
  RouteReuseStrategy,
  ActivatedRoute,
  RouterModule,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
  HttpClientJsonpModule,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { PublicModule } from "./public/public.module";
import { CompartitModule } from "./compartit/compartit.module";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { HttpIntercept } from "./interceptors/http.interceptor";
import { ErrorIntercept } from "./interceptors/error.interceptor";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx"; 
import { CalendarModule } from "primeng/calendar"; 

import { OrganizationChartModule } from "primeng/organizationchart"; //Plugin
import { SharedModule } from "primeng/api";
import { ChartModule } from "primeng/chart";
import { FormsModule } from "@angular/forms";
import { ToggleButtonModule } from "primeng/togglebutton";
import { EditorModule } from "primeng/editor";
import { Camera } from "@ionic-native/camera/ngx";
import { IonicStorageModule } from "@ionic/storage-angular";
import { Drivers } from "@ionic/storage";
// Firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { GooglePlus } from "@ionic-native/google-plus/ngx";
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    CalendarModule,
    HttpClientJsonpModule,
    PublicModule, 
    ToggleButtonModule,
    EditorModule,
    BrowserAnimationsModule,
    CompartitModule,
    OrganizationChartModule,
    ChartModule,
    SharedModule,
    FormsModule,  
    AngularFireModule.initializeApp(environment.firebaseConfig), 
    AngularFireAuthModule,
    IonicStorageModule.forRoot({
      name: "appinya", 
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
  ],
  providers: [
    StatusBar,
    AppVersion,
    SplashScreen,
    InAppBrowser,
    Camera,
    FingerprintAIO,
    GooglePlus,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      // processes all errors
      provide: ErrorHandler,
      useClass: ErrorIntercept,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercept,
      multi: true, // multiple interceptors are possible
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
