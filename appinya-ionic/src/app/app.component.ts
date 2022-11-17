/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021  Daniel Horta Vidal
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

import { Component, Input, ViewChildren } from "@angular/core"; 

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
  MenuController,
  Platform,
  NavController,
  AlertController,
  ToastController,
  LoadingController,
  IonTabs,
} from "@ionic/angular";
import { Router, NavigationEnd } from "@angular/router";
import { StoreData } from "./services/storage.data";
import { UsuariBs } from "./business/Usuari.business";
import { Menu } from "./entities/Menu";
import { DeviceService } from "./services/device.service";
import { delay, filter, mergeMap, retryWhen, tap } from "rxjs/operators";
import { EventService } from "./services/event.service";
import { RestService } from "./services/RestBase.service";
import { PaginaNavegacio } from "./compartit/components/PaginaNavegacio";
import { SelectItem, PrimeNGConfig } from "primeng/api";
/**
 * Classe Principal del programa
 */
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent extends PaginaNavegacio {
  //@ViewChildren("tabs") tabs: IonTabs;
  version: String = "Web";
  menuUsuari: Menu[];
  menuAmagat: boolean;
  tabBarAmagat: boolean;
  senseConexio: boolean;
  tabSelected: number = 3;
  constructor(
    private primengConfig: PrimeNGConfig,
    private platform: Platform,
    protected route: Router,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected alertCtrl: AlertController,
    protected toastCtrl: ToastController,
    protected loadingCtrl: LoadingController,
    protected menu: MenuController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    protected usuariBs: UsuariBs,
    protected eventService: EventService,
    protected deviceService: DeviceService,
    private restService: RestService
  ) {
    super(
      usuariBs,
      route,
      navCtrl,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
    this.initializeApp();
  }

  /**
   * Metode per inicialitzar la Web o el dispositu
   */
  async initializeApp() {
    this.version = "" + (await this.deviceService.obtenirVersioString());
    this.senseConexio = false;
    this.tabBarAmagat = false;
    this.menuAmagat = false;
    this.primengConfig.ripple = true;
    // Control de navegació per Treure els tabs
    this.route.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        let str = e.url;
        console.info("Navegar a " + str);
        if (
          str.includes("/public/optimitzar") ||
          str.includes("/public/acces") ||
          str.includes("/public/inicialitzar")
        )
          this.tabBarAmagat = true;
        else this.tabBarAmagat = false;
        if (str.includes("/public/home")) this.tabSelected = 3;
        else if (str.includes("/public/bustia")) this.tabSelected = 4;
        else if (str.includes("/public/agenda")) this.tabSelected = 2;
        else if (str.includes("/public/noticies")) this.tabSelected = 1;
        else this.tabSelected = 5;
      });
    console.info("S ha carregat Informació Usuari");
    this.platform.ready().then(async () => {
      console.info("S ha carregat el dispositiu");
      this.statusBar.styleDefault();
      try {
        this.splashScreen.hide();
      } catch (e) {
        console.error(e);
        this.splashScreen.hide();
      }
    });
    // Back button intervencio
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log("BackButton bloquejat!");
    });
    // Observador de errors
    this.eventService.obtenirObservableError((t: string) => {
      this.presentarAlerta("Error del sistema", t);
    });

    // Observador de l'estat de la conexio
    this.eventService.obtenirObservableConexio((t: boolean) => {
      console.info("Conexió " + t);

      if (t) {
        this.deviceService.activaConexio();
        this.senseConexio = !t;
      } else {
        if (!this.senseConexio) this.presentarMissatgeSenseConexio();
        this.deviceService.desActivaConexio();
        this.senseConexio = !t;
        this.restService
          .echo()
          .pipe(
            retryWhen((result) =>
              result.pipe(
                delay(10000),
                tap((error) => {
                  console.warn("ReConexio Error: " + error.missatge);
                }), // tap(() => {console.warn("Re intent conexió");}),
                delay(10000)
              )
            )
          )
          .subscribe(
            (t) => {
              console.info("Conexió Activa");
              if (this.senseConexio) this.presentarMissatgeAmbConexio();
              this.senseConexio = false;
              this.deviceService.activaConexio();
            },
            (e) => {
              console.warn("Sense Conexió activa");
              this.senseConexio = true;
              this.deviceService.desActivaConexio();
            }
          );
      }
    });
  }

  //amagarMenu() {
  //    this.menuUsuariAmagat = true;
  //    this.menu.enable(false);
  //    //const tabBar = document.getElementById('tabBar');
  //    //if (tabBar.style.display !== 'flex') tabBar.style.display = 'flex';
  //}
  //mostrarMenu() {
  //    this.menuUsuariAmagat = false;
  //    this.menu.enable(true);
  //    //const tabBar = document.getElementById('tabBar');
  //    //if (tabBar.style.display !== 'none') tabBar.style.display = 'none';
  //}
  /**
   * Subscripcion de eventos de la aplicacion todo centralizado en app.components
   */
  listenEvents() {
    // Evento para activar el menu lateral
    /*this.events.subscribe('menulateral:activate', () => {
            this.menu.enable(true);

        });
        // Evento para activar el menu lateral
        this.events.subscribe('recargar:menu',async () => {
            this.menuUsuari =await this.usuariBs.obtenirMenuUsuari();
            this.menu.enable(true);

        });

        this.events.subscribe('user:altacompletada', () => {
            console.info("usuari completat > Presentacio");
            this.navegarAInici();
        }); 
        //Evento de Logout del aplicativo
        this.events.subscribe('user:logout', () => {
            this.menu.enable(true);
            this.navegarAPagina("/public/desconexio")
        });
        //Evento de Error en el ematatzematge
        this.events.subscribe('error:localstore', (error) => {
            console.warn("Handler error:localstore");
            this.presentarAlerta("Error en base dades local", error);
            this.navegarAInici();
        });
        //Evento de Error en el conexio
        this.events.subscribe('error:conexio', () => {
            console.warn("Handler error:conexio");
            this.senseConexio = true;
            this.deviceService.desActivaConexio(); 
        });
        this.events.subscribe('activar:conexio', () => {
            console.warn("Handler activar:conexio");
            this.senseConexio = false;
            this.deviceService.activaConexio(); 
        });
       
        
        //Evento de Error en el credencials
        this.events.subscribe('error:credencials', () => {
            console.warn("Handler error:credencials");
            this.usuariBs.refrescarToken().then(token => {
                console.info("Token refrescat");
            }).catch(e => {
                this.presentarAlertaCredencialsCaducades(); 
                this.storeData.logout();
                this.navegarAIniciarSessio();
            });
        });
         
        //Evento de Error en el servidor
        this.events.subscribe('error:servidor', (status, error) => {
            console.warn("Handler error:servidor");
            this.presentarAlerta('Error al servidor ', "Error status " + status + " " + error )
        });

        //Evento de Obrir fitxa
        this.events.subscribe('user:fitxa', () => {
            this.menu.enable(true);
            this.navegarAPagina("/public/accedeix");
        });
         */
  }
  reconect() {
    // this.sincronitzacioDBBs.actualitzarPaquets(true);
  }
}
