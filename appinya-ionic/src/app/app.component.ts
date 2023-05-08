
/**
 *  Appinya Open Source Project
 *  Copyright (C) 2023  Daniel Horta Vidal
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
import { Component, } from "@angular/core";

import {
  MenuController,
  Platform,
  NavController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Router, NavigationEnd } from "@angular/router";
import { Menu } from "./entities/Menu";
import { DeviceService } from "./services/device.service";
import { delay, filter, mergeMap, retryWhen, tap } from "rxjs/operators";
import { EventService } from "./services/event.service";
import { RestService } from "./services/RestBase.service";

import { PrimeNGConfig } from "primeng/api";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from "@awesome-cordova-plugins/status-bar/ngx";
import { Constants } from "./Constants";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //@ViewChildren("tabs") tabs: IonTabs;
  version: String = "Web";
  menuUsuari: Menu[] = [];
  menuAmagat: boolean = true;
  tabBarAmagat: boolean = true;
  senseConexio: boolean = false;
  tabSelected: number = 3;
  tab1URL: String = Constants.URL_NOTICIES;
  tab2URL: String = Constants.URL_AGENDA;
  tab3URL: String = Constants.URL_HOME;
  tab4URL: String = Constants.URL_OPTIONS;
  constructor(
    private primengConfig: PrimeNGConfig,
    private platform: Platform,
    protected route: Router,
    protected alertCtrl: AlertController,
    protected toastCtrl: ToastController,
    protected menu: MenuController,
    protected splashScreen: SplashScreen,
    protected statusBar: StatusBar,
    protected eventService: EventService,
    protected deviceService: DeviceService,
    private restService: RestService
  ) {

    this.initializeApp();
  }
  onTabsWillChange(event: any) {
    console.info(event.tab);

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
          str.includes(Constants.URL_OPTIMITIZAR) ||
          str.includes(Constants.URL_ACCES) ||
          str.includes(Constants.URL_INICIALITZAR)
        )
          this.tabBarAmagat = true;
        else this.tabBarAmagat = false;
        if (str.includes(Constants.URL_HOME)) this.tabSelected = 3;
        else if (str.includes(Constants.URL_BUSTIA)) this.tabSelected = 4;
        else if (str.includes(Constants.URL_CALENDAR)) this.tabSelected = 2;
        else if (str.includes(Constants.URL_NOTICIES)) this.tabSelected = 1;
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
      console.log(Constants.MSM_BACK_BUTTON_DISABLED);
    });
    // Observador de errors
    this.eventService.obtenirObservableError((t: string) => {
      this.presentarAlerta(Constants.MSM_TITOL_ERROR_SYS, t);
    });
    // Observador de errors
    this.eventService.obtenirObservableCredebcials((t: string) => {
      this.presentarAlerta(Constants.MSM_TITOL_ERROR_CRE, t);
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
  public async presentarMissatgeAmbConexio() {
    let toast = await this.toastCtrl.create({
      message:
        '<ion-icon class="mitja" color="blanc" name="wifi"></ion-icon>  Connexió a internet activa',
      color: "verd",
      position: "middle",
      duration: 1000,
    });
    toast.present();
  }
  public async presentarMissatgeSenseConexio() {
    let toast = await this.toastCtrl.create({
      message:
        '<ion-icon class="mitja" color="blanc" name="wifi"></ion-icon>  No hi ha connexió a internet',
      color: "primary",
      position: "middle",
      duration: 1000,
    });
    toast.present();
  }
  public async presentarAlerta(titol: string, missatge: string): Promise<void> {
    // create an alert instance
    let alert = await this.alertCtrl.create({
      header: titol,
      message: missatge,
    });
    return alert.present();
  }
  /**
   * Presentar Missatge a l'usuari
   * @param missatge missatge a presentar
   * @param temps temps de durada del missatge
   */
  public async presentarMissatge(missatge: string, temps: number) {
    let toast = await this.toastCtrl.create({
      message: missatge,
      duration: temps,
    });
    toast.present();
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

