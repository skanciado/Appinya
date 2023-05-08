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
 **/ import { OverlayEventDetail } from "@ionic/core";
import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  IonFab,
} from "@ionic/angular";
import { PaginaNavegacio } from "../../compartit/components/PaginaNavegacio";
import { StoreData } from "../../services/storage.data";
import { IEsdevenimentDetallFormModel } from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { EventService } from "src/app/services/event.service";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";

import { AssistenciaEsdevenimentComponent } from "./assistencia.esdeveniment.comp";
import { DeviceService } from "src/app/services/device.service";
import { CastellPopUp } from "./castell.popup";
import { PrevisioAssistenciaPopUp } from "src/app/compartit/popups/previsioAssistencia.popup";
@Component({
  selector: "esdeveniment",
  templateUrl: "esdeveniment.page.html",
  styleUrls: ["./esdeveniment.page.scss"],
})
export class EsdevenimentPage extends PaginaNavegacio implements OnInit {
  @ViewChild("mapCanvas") mapElement: ElementRef | undefined;

  @ViewChild("carregant") carregant: CarregantLogoComponent | undefined;
  @ViewChild("assistenciaForm")
  assistenciaForm: AssistenciaEsdevenimentComponent | undefined;
  menuBloquejat: boolean = false;
  menuActiu: boolean = false;
  pestanya: String = "detall";
  checked: boolean = true;
  bpotEditar: boolean = false;
  bpotCrearCastell: boolean = false;
  id: string | null = null;
  tipusEsdeveniment: string | undefined;
  esdevenimentDetall: IEsdevenimentDetallFormModel | undefined;

  /**
   * Constructor
   * @param navCtrl
   * @param usuariBs
   * @param activatedRoute
   * @param alertCtrl
   * @param store
   * @param modalCtrl
   * @param loadingCtrl
   * @param toastCtrl
   * @param storeData
   * @param events
   * @param esdevenimentBs
   * @param castellersBs
   * @param assistenciaBs
   * @param sincronitzacioDBBs
   */
  constructor(
    protected httpClient: HttpClient,
    route: Router,
    navCtrl: NavController,
    usuariBs: UsuariBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected castellersBs: CastellersBs,
    protected sincronitzarBs: SincronitzacioDBBs,
    protected deviceService: DeviceService,
    protected activatedRoute: ActivatedRoute,
    alertCtrl: AlertController,
    protected store: StoreData,
    protected modalCtrl: ModalController,
    loadingCtrl: LoadingController,
    toastCtrl: ToastController,
    storeData: StoreData,
    protected eventService: EventService
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
  }

  // Variables Google Maps
  posicio: google.maps.LatLngLiteral | undefined;
  loadMap: boolean = true;
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  apiLoaded: boolean = false;

  /**
   * Crea la promesa per enviar a la pantalla de carga
   */
  async crearPromesaEsdeveniment(): Promise<IEsdevenimentDetallFormModel | undefined> {

    let esdevenimentDetallWrk =
      await this.esdevenimentBs.obtenirEsdevenimentDetallModelStored(this.id!);
    if (esdevenimentDetallWrk == null) {
      try {
        esdevenimentDetallWrk =
          await this.esdevenimentBs.obtenirEsdevenimentDetallModel(this.id!);
      } catch (er) {
        this.presentarMissatgeError(
          "No es pot carregar el detall, no hi ha connexió"
        );
        this.navegarAEnrera();
        this.eventService.enviarEventSenseConexio();
        return;
      }
    } else {
      let date: Date = new Date();
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      let dateS: String = date.toISOString();
      if (
        (esdevenimentDetallWrk.DataFi.indexOf("T00:00:00") > 0 &&
          esdevenimentDetallWrk.DataFi.substring(0, 10) <
          dateS.substring(0, 10)) ||
        (esdevenimentDetallWrk.DataFi.indexOf("T00:00:00") <= 0 &&
          esdevenimentDetallWrk.DataFi < dateS)
      ) {
        esdevenimentDetallWrk.BloquejarAssistencia = true;
      }
    }
    return esdevenimentDetallWrk;
  }
  /**
   * Retorn del esdeveniemnt de finalitzacio de la carga
   * @param esdevenimentDetallWrk
   */
  async carregarEsdeveniement(
    esdevenimentDetallWrk: IEsdevenimentDetallFormModel
  ) {
    this.tipusEsdeveniment = esdevenimentDetallWrk.TipusEsdeveniment;
    if (esdevenimentDetallWrk.Longitud && esdevenimentDetallWrk.Latitud) {
      this.posicio = {
        lat: esdevenimentDetallWrk.Latitud,
        lng: esdevenimentDetallWrk.Longitud,
      };
      this.loadMap = true;
    } else {
      this.loadMap = false;
    }
    this.bpotEditar = await this.esdevenimentBs.potEditar(
      esdevenimentDetallWrk
    );
    this.bpotCrearCastell =
      this.isAdmin() || this.isTecnica() || this.isTecnicaNivell2();

    this.esdevenimentDetall = esdevenimentDetallWrk;
    this.menuBloquejat = this.esdevenimentDetall.Bloquejat;

    this.menuActiu = !this.esdevenimentDetall.Anulat;
    // S'actualitza la informació amb el servidor
    this.esdevenimentBs.obtenirEsdevenimentDetallModel(this.id!).then((esd) => {
      this.tipusEsdeveniment = esdevenimentDetallWrk.TipusEsdeveniment;
      esdevenimentDetallWrk = esd;
      if (esdevenimentDetallWrk.Longitud && esdevenimentDetallWrk.Latitud) {
        this.posicio = {
          lat: esdevenimentDetallWrk.Latitud,
          lng: esdevenimentDetallWrk.Longitud,
        };
      }
      let date: Date = new Date();
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      let dateS: String = date.toISOString();
      if (
        (esdevenimentDetallWrk.DataFi.indexOf("T00:00:00") > 0 &&
          esdevenimentDetallWrk.DataFi.substring(0, 10) <
          dateS.substring(0, 10)) ||
        (esdevenimentDetallWrk.DataFi.indexOf("T00:00:00") <= 0 &&
          esdevenimentDetallWrk.DataFi < dateS)
      ) {
        esdevenimentDetallWrk.BloquejarAssistencia = true;
      }
      this.esdevenimentDetall = esdevenimentDetallWrk;
    });
  }
  // Crear un Castell
  async crearCastell() {
    let modal = await this.modalCtrl.create({
      component: CastellPopUp,
      componentProps: {
        idEsdeveniment: this.esdevenimentDetall!.Id,
        castell: null,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        await this.actualitzarEsdeveniment();
      }
    });
    modal.present();
  }
  /**
   * Qualsevol canvi del formulari d'assitencia
   * @returns
   */
  canviarFormulari() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }

    if (this.esdevenimentDetall?.AssistenciaPersonal?.Assistire != true) {
      this.presentarMissatgeError("Avís: s'ha de confirmar l'assistència");
      return;
    }
    if (this.esdevenimentDetall.AssistenciaPersonal.ConfirmacioTecnica) {
      this.presentarAlerta(
        "No es pot modificar la teva assistència.",
        "S'ha confirmat la teva assistència (o no assistència) per un responsable.  Si vols fer algun canvi parla amb el teu referent."
      );
      return;
    }
    this.assistenciaBs
      .confirmarAssistenciaFormulari(
        this.esdevenimentDetall.AssistenciaPersonal,
        this.esdevenimentDetall.Delegats,
        this.esdevenimentDetall.Referenciats
      )
      .then((res) => {
        if (!res.Correcte) {
          this.presentarMissatgeError(res.Missatge);
        }
      })
      .catch((err) => {
        this.presentarAlerta(
          "Error en la confirmació",
          "No s'ha pogut confirmar (" + err + ")"
        );
      });
  }
  /**
   * Funcion inici
   * */
  async ngOnInit() {
    //pestanya actual
    this.pestanya = "detall";
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    /*this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.API_GOOGLE_KEY}`, 'callback')
        .pipe(
            map(() => true), 
            catchError((e) => of(false)),
        ).subscribe ( load=> {
            if (load ) {
                var script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDnHMQ0FcmUKN3iiJ4bHo9NtghYw4xFQdU';        
                script.type = "text/javascript";
               // this.mapElement.nativeElement.appendChild(script);
                this.apiLoaded = true;
            }
        } ); 
    */

    this.addGoogleMapScript();
  }
  /**
   * Despres de incializar la part grafica
   */
  ngAfterViewInit() {
    this.carregant!.carregarPromise(this.crearPromesaEsdeveniment());
  }

  /**
   * Funcio per presentar l'alerta per pantalla quan confirmes l'assistencia
   * @param nom Nom del casteller
   * @param ass Si assisteix o No
   */
  comptenAmbTu(nom: string, ass: boolean) {
    this.presentarAlerta(
      !ass ? "No comptem amb " + nom : "Comptem amb " + nom,
      "Els tècnics han regitrat la teva assistencia. Contacta amb un tècnic per canviar l'assistència"
    );
  }

  /* *
   * Metode per Accedir a la pantalla d'edició de l'esdeveniment
   * */
  editEsdeveniment() {
    this.navegarAEsdevenimentForm(this.esdevenimentDetall!.Id);
  }
  /**
   * Opcions Menu Copia esdeveniment
   */
  copiarEsdeveniment() {
    this.navegarAEsdevenimentForm(this.esdevenimentDetall!.Id, true);
  }
  /**
   * Opcions Menu bloquejar
   */
  async bloquejar() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    const alert = await this.alertCtlr.create({
      header: "Bloquejar assistència!",
      message: "Vols bloquejar l'assistència?",
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Bloquejar",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.bloquejarEsdeveniment(
              this.esdevenimentDetall!,
              true
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha bloquejat l'esdeveniment", 3000);
              await this.sincronitzarBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  /**
   * Opcions Menu Desbloquejar
   */
  async desbloquejar() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    const alert = await this.alertCtlr.create({
      header: "Desbloquejar assistència?",
      message: "Vols desbloquejar l'assistència?",
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Desbloquejar",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.bloquejarEsdeveniment(
              this.esdevenimentDetall!,
              false
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha desbloquejat l'esdeveniment", 3000);
              await this.sincronitzarBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  /**
   * Opcions Menu Anular
   */
  async anular() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    const alert = await this.alertCtlr.create({
      header: "Anular esdeveniment!",
      message: "Vols anular l'esdeveniment? (serà visible pels castellers)",
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Anular",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.anularEsdeveniment(
              this.esdevenimentDetall!
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha anulat l'esdeveniment", 3000);
              await this.sincronitzarBs.actualitzarPaquets();
              this.navegarAAgenda();
            }
          },
        },
      ],
    });
    alert.present();
  }
  /**
   * Opcions Menu Activar
   */
  async activar() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: "Enviant informació",
      duration: 3000,
    });
    await loading.present();
    let r = await this.esdevenimentBs.activarEsdeveniment(
      this.esdevenimentDetall!
    );
    loading.dismiss();
    if (!r.Correcte) {
      this.presentarMissatgeError(r.Missatge);
    } else {
      this.presentarMissatge("S'ha activat l'esdeveniment", 3000);
      await this.sincronitzarBs.actualitzarPaquets();
      this.navegarAEnrera();
    }
  }
  /**
   * Opcions Menu desactivar
   */
  async desactivar() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    const alert = await this.alertCtlr.create({
      header: "Desactivar esdeveniment!",
      message: "Vols desactivar l'esdeveniment?",
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Desactivar",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.activarEsdeveniment(
              this.esdevenimentDetall!
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha desactivat l'esdeveniment", 3000);
              await this.sincronitzarBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  /**
   * Opcions Menu Esborrar
   */
  async esborrarEsdeveniment() {
    const alert = await this.alertCtlr.create({
      header: "Esborrar esdeveniment!",
      message: "Vols esborrar l'esdeveniment?",
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Eliminar",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.esborrarEsdeveniment(
              this.esdevenimentDetall!
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha esborrat l'esdeveniment", 3000);
              await this.sincronitzarBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  /**
   * Metode d'exportació d'informació de l'assistencia
   * */
  exportar() {
    this.assistenciaBs
      .exportarExcelAssitencia(this.esdevenimentDetall!.Id)
      .then((t) => {
        this.presentarMissatge(
          "Comprova els teus emails, ja tens l'excel d'assistència",
          3000
        );
      });
  }
  /**
   * Actualitzar l'esdeveniment
   */
  async actualitzarEsdeveniment() {
    await this.sincronitzarBs.actualitzarPaquets();
    this.esdevenimentDetall =
      await this.esdevenimentBs.obtenirEsdevenimentDetallModel(this.id!);
  }
  canviPestanya(event: any) {
    console.log("Segment changed", event);
    if (event == "assistencia") {
      this.assistenciaForm!.refrescar(this.esdevenimentDetall!);
    }
  }
  async pervisioAssitencia() {
    let modal = await this.modalCtrl.create({
      component: PrevisioAssistenciaPopUp,
      componentProps: {
        idEsdeveniment: this.esdevenimentDetall!.Id,
        castell: null,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        await this.actualitzarEsdeveniment();
      }
    });
    modal.present();
  }
  /**
   * Confiramcio de transport (per defecte anada i tornada)
   * @param transport
   */
  transportPersonal(transport: boolean) {
    this.esdevenimentDetall!.AssistenciaPersonal!.TransportAnada = transport;
    this.esdevenimentDetall!.AssistenciaPersonal!.TransportTornada = transport;
    this.confirmar(true);
  }
  /**
   * Metode pe confirmar l'assitencia del casteller
   * @param assitire Boolea de si assistira o no
   */
  async confirmar(assitire: boolean) {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    if (this.esdevenimentDetall?.BloquejarAssistencia == true) {
      this.presentarAlerta(
        "Assistencia Bloquejada",
        "L'assistència està actualment bloquejada."
      );
      return;
    }
    if (this.esdevenimentDetall?.AssistenciaPersonal?.ConfirmacioTecnica) {
      this.presentarAlerta(
        "No es pot modificar la teva assistència.",
        "S'han confirmat la teva assistència (o no assistència) per un responsable.  Si vols fer algun canvi, parla amb el teu referent."
      );
      return;
    }
    let carregant = await this.presentarCarregant(
      "Enviant Informació al servidor"
    );
    carregant.present();
    this.esdevenimentDetall!.AssistenciaPersonal!.Assistire = assitire;

    this.assistenciaBs
      .confirmarAssistenciaFormulari(
        this.esdevenimentDetall!.AssistenciaPersonal!,
        this.esdevenimentDetall!.Delegats,
        this.esdevenimentDetall!.Referenciats
      )
      .then((res) => {
        if (!res.Correcte) {
          this.presentarMissatgeError(res.Missatge);
        } else {
          this.actualitzarEsdeveniment();
        }
        carregant.dismiss();
      })
      .catch((err) => {
        this.presentarAlerta(
          "Error en la confirmació",
          "No s'ha pogut confirmar (" + err + ")"
        );
        carregant.dismiss();
      });
  }
  /**
   *  Metode per saber si te permisos per editar en el formulari
   * */
  potEditar(): boolean {
    return this.bpotEditar;
  }

  /**
   * Metode per obrir el Google Maps
   * */
  public obrirGoogleMaps() {
    if (this.deviceService.esEntornWeb()) {
      open(`https://www.google.com/maps/search/?api=1&map_action=map&center=${this.esdevenimentDetall!.Latitud}%2C${this.esdevenimentDetall!.Longitud}&zoom=16&query=${this.esdevenimentDetall!.Latitud}%2C${this.esdevenimentDetall!.Longitud}`, "maps")
    } else {
      window.open(
        `geo://${this.esdevenimentDetall!.Latitud},${this.esdevenimentDetall!.Longitud}?q=${this.esdevenimentDetall!.Latitud},${this.esdevenimentDetall!.Longitud}(${this.esdevenimentDetall!.Titol})`,
        "_system"
      );
    }
  }

  /**
   * Agregar l'escript de Google a la pagina
   */
  public addGoogleMapScript() {
    this.removeGoogleMapScript();
    console.debug("adding google script...");
    let node = document.createElement("script");
    node.src = `https://maps.googleapis.com/maps/api/js?key=${environment.API_GOOGLE_KEY}&callback=initMap`;
    node.type = "text/javascript";
    node.async = false;
    (<any>window).initMap = function () {
      console.info("Google Lib - llibreria cargada")
    };
    document.head.appendChild(node);
  }
  /**
   * Elimina l'escript de Google de la pagina
   */
  private removeGoogleMapScript() {
    console.debug("removing google script...");
    let keywords = ["maps.googleapis"];

    //Remove google from BOM (window object)
    //window.google = undefined;

    //Remove google map scripts from DOM
    let scripts = document.head.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      let scriptSource = scripts[i].getAttribute("src");
      if (scriptSource != null) {
        if (keywords.filter((item) => scriptSource?.includes(item)).length) {
          scripts[i].remove();
          // scripts[i].parentNode.removeChild(scripts[i]);
        }
      }
    }
  }
}
