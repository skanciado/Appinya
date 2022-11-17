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

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { OverlayEventDetail } from "@ionic/core";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Data, ParamMap, Route, Router } from "@angular/router";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
} from "@angular/forms";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  IEntitatHelper,
  IEsdevenimentModel,
} from "src/app/entities/interfaces";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
import { Storage } from "@ionic/storage";
import { CastellersBs } from "src/app/business/casteller.business";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { environment } from "src/environments/environment";
import { TipusPreguntaPopUp } from "src/app/compartit/popups/tipuspregunta.popup";
import { map } from "rxjs/operators";
import { Constants } from "src/app/Constants";

@Component({
  selector: "esdeveniment.edit-page",
  templateUrl: "esdeveniment.edit.html",
  styleUrls: ["./esdeveniment.edit.scss"],
})
export class EsdevenimentEditPage extends PaginaNavegacio implements OnInit {
  constructor(
    protected usuariBs: UsuariBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected castellerBs: CastellersBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected storage: Storage,
    protected device: DeviceService,
    protected toastCtrl: ToastController,
    protected camera: Camera,
    protected fb: FormBuilder,
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected actionSheetController: ActionSheetController
  ) {
    super(
      usuariBs,
      router,
      navCtrl,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
    this.anyMaxim = "" + new Date().getFullYear() + 2;
  }
  es: any = Constants.es_ES;
  id: string;
  anyMaxim: string = "";
  titol2: String = "";
  tipusEsdeveniment: IEntitatHelper[] = [];
  formulari: FormGroup = null;
  esWeb: boolean = false;
  value: Date;
  posicio: google.maps.LatLngLiteral;
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  apiLoaded: boolean = false;

  menuBloquejat: boolean = false;
  menuActiu: boolean = false;
  menuAn: boolean = false;
  /**
   * Function de Validacion Data
   * @returns
   */
  dataValidator(): ValidatorFn {
    /*return this.fndataValidator;*/
    return (control: AbstractControl): { [key: string]: any } | null => {
      let dataIni = control.get("DataIniCalendar").value;
      let dataFi = control.get("DataFiCalendar").value;
      let totElDia = control.get("TotElDia").value;
      if (!dataIni || !dataFi)
        return { dataValidator: true, horaValidator: false };
      else if (dataIni > dataFi)
        return { dataValidator: true, horaValidator: false };
      else if (dataIni.length <= 10 && totElDia == false)
        return { dataValidator: false, horaValidator: true };
      else if (dataFi.length <= 10 && totElDia == false)
        return { dataValidator: false, horaValidator: true };

      return null;
    };
  }
  changeTotElDia() {
    let totElDia = null; //control.get("TotElDia").value;
    if (totElDia) {
      //control.get("DataIni").setValue(dataIni.substr(0, 10) + "T00:00:00");
      //control.get("dataFi").setValue(dataFi.substr(0, 10) + "T00:00:00");
    }
  }

  /**
   * Agregar l'escript de Google a la pagina
   */
  private addGoogleMapScript() {
    return new Promise((resolve, reject) => {
      this.removeGoogleMapScript();
      console.debug("adding google script...");
      let node = document.createElement("script");
      node.src = `https://maps.googleapis.com/maps/api/js?key=${environment.API_GOOGLE_KEY}&libraries=places`;
      node.type = "text/javascript";
      node.async = true;
      node.defer = true;
      node.onload = resolve;
      node.onerror = reject;
      document.head.appendChild(node);
    });
  }
  /**
   * Elimina l'escript de Google de la pagina
   */
  private removeGoogleMapScript() {
    console.debug("removing google script...");
    let keywords = ["maps.googleapis"];

    //Remove google from BOM (window object)
    window.google = undefined;

    //Remove google map scripts from DOM
    let scripts = document.head.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      let scriptSource = scripts[i].getAttribute("src");
      if (scriptSource != null) {
        if (keywords.filter((item) => scriptSource.includes(item)).length) {
          scripts[i].remove();
          // scripts[i].parentNode.removeChild(scripts[i]);
        }
      }
    }
  }
  /**
   * Funcio d'inici
   */
  async ngOnInit() {
    this.esWeb = this.device.esEntornWeb();
    this.addGoogleMapScript().then(() => {
      console.log("Load Libriary");
      this.apiLoaded = true;
      let autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete") as HTMLInputElement,
        {
          types: ["establishment"],
          componentRestrictions: { country: ["ES"] },
          fields: ["place_id", "geometry", "name"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          this.presentarMissatge("No s'ha triat una ubicació", 3000);
        } else {
          this.Latitud.setValue(place.geometry.location.lat());
          this.Longitud.setValue(place.geometry.location.lng());
          this.posicio = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
        }
        console.info("Change Places" + place.geometry.location);
      });
    });

    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    this.activatedRoute.queryParams.subscribe(async (params) => {
      let clone = params["clone"] ?? false;
      this.prepararEsdeveniment(clone);

      this.tipusEsdeveniment = (
        await this.storeData.obtenirTipusEsdeveniments()
      ).filter((tipus) => {
        if (
          this.isJunta() ||
          this.isNoticier() ||
          this.isAdmin() ||
          this.isSecretari()
        )
          return true;
        if (tipus.Id == "6" && this.isCapMusic()) return true;
        if ((tipus.Id == "5" || tipus.Id == "4") && this.isOrganitzador())
          return true;
        return false;
      });
    });
  }
  async prepararEsdeveniment(clone: boolean) {
    let esdeveniment: IEsdevenimentModel = null;
    if (this.id != "0") {
      esdeveniment = await this.esdevenimentBs.obtenirEsdeveniment(this.id);
      if (esdeveniment == null) {
        esdeveniment = await this.esdevenimentBs.obtenirEsdevenimentServer(
          this.id
        );
      }
    }

    if (esdeveniment == null) {
      esdeveniment = {
        Id: "0",
        DataIni: new Date().toISOString().substr(0, 10) + "T12:00:00",
        DataFi: new Date().toISOString().substr(0, 10) + "T14:00:00",
        Descripcio: "",
        Titol: "",
        Direccio: "",
        TipusEsdeveniment: "1",
        OfereixTransport: false,
        Latitud: null,
        Longitud: null,
        Responsable: null,
        Confirmat: false,
        Anulat: false,
        Actiu: true,
        Bloquejat: false,
        Preguntes: [],
        Temporada: (await this.storeData.obtenirTemporada()).Id,
        TransportAnada: false,
        TransportTornada: false,
        DataActualitzacio: new Date().toISOString().substring(0, 10),
      };
    } else if (clone) {
      console.log("Clonando evento");
      esdeveniment.Id = "0";
    }
    if (esdeveniment.Longitud && esdeveniment.Latitud) {
      this.posicio = {
        lat: esdeveniment.Latitud,
        lng: esdeveniment.Longitud,
      };
    } else {
      this.posicio = {
        lat: environment.LLOC_ENTRENAMENT_LATITUD,
        lng: environment.LLOC_ENTRENAMENT_LONGITUD,
      };
    }
    this.titol2 = esdeveniment.Titol;

    // Menu opcions
    this.menuBloquejat = esdeveniment.Bloquejat;

    this.menuActiu = !esdeveniment.Anulat;
    this.formulari = this.fb.group(
      {
        Id: new FormControl(esdeveniment.Id, [Validators.required]),
        Titol: new FormControl(esdeveniment.Titol, [Validators.required]),
        TipusEsdeveniment: new FormControl(esdeveniment.TipusEsdeveniment, [
          Validators.required,
        ]),
        Descripcio: new FormControl(esdeveniment.Descripcio, [
          Validators.required,
        ]),
        Actiu: new FormControl(esdeveniment.Actiu, [Validators.required]),
        Bloquejat: new FormControl(esdeveniment.Bloquejat),
        DataIni: new FormControl(esdeveniment.DataIni),
        DataFi: new FormControl(esdeveniment.DataFi),
        DataIniCalendar: new FormControl(new Date(esdeveniment.DataIni)),
        DataFiCalendar: new FormControl(new Date(esdeveniment.DataFi)),
        Latitud: new FormControl(esdeveniment.Latitud),
        Longitud: new FormControl(esdeveniment.Longitud),
        Direccio: new FormControl(esdeveniment.Direccio),
        Preguntes: new FormControl(esdeveniment.Preguntes),
        OfereixTransport: new FormControl(esdeveniment.OfereixTransport, [
          Validators.required,
        ]),
        TransportAnada: new FormControl(esdeveniment.TransportAnada, [
          Validators.required,
        ]),
        TransportTornada: new FormControl(esdeveniment.TransportTornada, [
          Validators.required,
        ]),
        TotElDia: new FormControl(
          esdeveniment.DataIni.endsWith("T00:00:00") &&
            esdeveniment.DataFi.endsWith("T00:00:00"),
          [Validators.required]
        ),
        MesDunDia: new FormControl(
          esdeveniment.DataIni.substring(0, 10) !=
            esdeveniment.DataFi.substring(0, 10),
          [Validators.required]
        ),
      },
      {
        validators: this.dataValidator(),
      }
    );
  }
  /**
   * Entrar en pantalla
   */
  ionViewDidEnter() {
    this.anyMaxim = "" + (new Date().getFullYear() + 2);
  }
  /**
   * Funcio de canvi de titol superior
   */
  canviarTitol(event) {
    this.Titol.setValue(event.target.value);
  }
  /**
   * Canviar el dia del esdeveniment
   */
  canviaTotElDia(e) {
    console.log("Entra en tot el dia ");
    if (this.formulari.get("TotElDia").value) {
      this.formulari
        .get("DataIniCalendar")
        .setValue(
          this.formulari.get("DataIniCalendar").value.substring(0, 10) +
            "T00:00:00"
        );
      this.formulari
        .get("DataFiCalendar")
        .setValue(
          this.formulari.get("DataFiCalendar").value.substring(0, 10) +
            "T00:00:00"
        );
    } else {
      this.formulari
        .get("DataIniCalendar")
        .setValue(
          this.formulari.get("DataIniCalendar").value.substring(0, 10) +
            "T12:00:00"
        );
      this.formulari
        .get("DataFiCalendar")
        .setValue(
          this.formulari.get("DataFiCalendar").value.substring(0, 10) +
            "T14:00:00"
        );
    }
  }

  changeDataFi() {
    if (
      this.formulari.get("DataIniCalendar").value >
      this.formulari.get("DataFiCalendar").value
    ) {
      this.formulari
        .get("DataIniCalendar")
        .setValue(this.formulari.get("DataFiCalendar").value);
    }
  }
  changeDataInici() {
    if (
      this.formulari.get("DataIniCalendar").value >
      this.formulari.get("DataFiCalendar").value
    ) {
      this.formulari
        .get("DataFiCalendar")
        .setValue(this.formulari.get("DataIniCalendar").value);
    }
  }
  get Id() {
    return this.formulari.get("Id");
  }

  get Titol() {
    return this.formulari.get("Titol");
  }
  get Direccio() {
    return this.formulari.get("Direccio");
  }
  get Longitud() {
    return this.formulari.get("Longitud");
  }
  get Latitud() {
    return this.formulari.get("Latitud");
  }
  get TipusEsdeveniment() {
    return this.formulari.get("TipusEsdeveniment");
  }
  get Descripcio() {
    return this.formulari.get("Descripcio");
  }
  get Indefinida() {
    return this.formulari.get("Indefinida");
  }
  get DataIni() {
    return this.formulari.get("DataIni");
  }
  get DataIniCalendar() {
    return this.formulari.get("DataIniCalendar");
  }
  get DataFin() {
    return this.formulari.get("DataFin");
  }
  get DataFinCalendar() {
    return this.formulari.get("DataFinCalendar");
  }
  get Preguntes() {
    return this.formulari.get("Preguntes");
  }
  get OfereixTransport() {
    return this.formulari.get("OfereixTransport");
  }
  get TransportAnada() {
    return this.formulari.get("TransportAnada");
  }
  get TransportTornada() {
    return this.formulari.get("TransportTornada");
  }
  get Bloquejat() {
    return this.formulari.get("Bloquejat");
  }
  get TotElDia() {
    return this.formulari.get("TotElDia");
  }
  get Actiu() {
    return this.formulari.get("Actiu");
  }
  get MesDunDia() {
    return this.formulari.get("MesDunDia");
  }
  /**
   * Confirmar Formulari
   * @returns
   */
  async onSubmit() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    this.formulari.markAllAsTouched();
    if (this.formulari.valid) {
      let dini = this.formulari.get("DataIniCalendar").value;
      let dFin = this.formulari.get("DataFiCalendar").value;
      this.formulari
        .get("DataIni")
        .setValue(new Date(dini.getTime() - dini.getTimezoneOffset() * 60000));
      this.formulari
        .get("DataFi")
        .setValue(new Date(dFin.getTime() - dFin.getTimezoneOffset() * 60000));

      const loading = await this.loadingCtrl.create({
        message: "Enviant informació ",
        duration: 10000,
      });
      await loading.present();

      let r = await this.esdevenimentBs.desarEsdeveniment(this.formulari.value);
      loading.dismiss();
      if (!r.Correcte) {
        this.presentarMissatgeError(r.Missatge);
      } else {
        if (this.id != "0")
          this.presentarMissatge("S'ha modificat l'esdeveniment", 3000);
        else this.presentarMissatge("S'ha creat l'esdeveniment", 3000);
        await this.sincronitzacioDBBs.actualitzarPaquets();
        this.navegarAEnrera();
      }
    }
    console.warn(this.formulari.value);
  }

  async modificar(p1) {
    let modal = await this.modalCtrl.create({
      component: TipusPreguntaPopUp,
      componentProps: { preguntes: this.Preguntes.value, pregunta: p1 },
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        let arr = this.Preguntes.value;
        arr.push(detail.data);
        this.Preguntes.setValue(arr);
      }
    });
    modal.present();
  }
  async afegirPregunta() {
    let modal = await this.modalCtrl.create({
      component: TipusPreguntaPopUp,
      componentProps: { preguntes: this.Preguntes.value },
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        let arr = this.Preguntes.value;
        arr.push(detail.data);
        this.Preguntes.setValue(arr);
      }
    });
    modal.present();
  }
  async bloquejar() {
    if (!this.device.esConexioActiva()) {
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
            this.formulari.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.bloquejarEsdeveniment(
              this.formulari.value,
              true
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha bloquejat l'esdeveniment", 3000);
              await this.sincronitzacioDBBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }

  async desbloquejar() {
    if (!this.device.esConexioActiva()) {
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
            this.formulari.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.bloquejarEsdeveniment(
              this.formulari.value,
              false
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha desbloquejat l'esdeveniment", 3000);
              await this.sincronitzacioDBBs.actualitzarPaquets();
              this.navegarAAgenda();
            }
          },
        },
      ],
    });
    alert.present();
  }

  async anular() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    const alert = await this.alertCtlr.create({
      header: "Anular esdeveniment!",
      message:
        "Vols anular l'esdeveniment? (serà visible per tots els castellers)",
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
            this.formulari.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.anularEsdeveniment(
              this.formulari.value
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha anulat l'esdeveniment", 3000);
              await this.sincronitzacioDBBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  async activar() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    this.formulari.markAllAsTouched();
    const loading = await this.loadingCtrl.create({
      message: "Enviant informació",
      duration: 3000,
    });
    await loading.present();
    let r = await this.esdevenimentBs.activarEsdeveniment(this.formulari.value);
    loading.dismiss();
    if (!r.Correcte) {
      this.presentarMissatgeError(r.Missatge);
    } else {
      this.presentarMissatge("S'ha activat l'esdeveniment", 3000);
      await this.sincronitzacioDBBs.actualitzarPaquets();
      this.navegarAEnrera();
    }
  }
  async desactivar() {
    if (!this.device.esConexioActiva()) {
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
            this.formulari.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.activarEsdeveniment(
              this.formulari.value
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha desactivat l'esdeveniment", 3000);
              await this.sincronitzacioDBBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }

  /**
   * Esborrar La esdeveniment
   * @returns
   */
  async esborrar() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
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
            this.formulari.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.esdevenimentBs.esborrarEsdeveniment(
              this.formulari.value
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha esborrat l'esdeveniment", 3000);
              await this.sincronitzacioDBBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  cancelar() {
    this.navegarAEnrera();
  }
  click(event: google.maps.MouseEvent) {
    console.log(event);

    this.Latitud.setValue(event.latLng.lat());
    this.Longitud.setValue(event.latLng.lng());
    this.posicio = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
  }
}
