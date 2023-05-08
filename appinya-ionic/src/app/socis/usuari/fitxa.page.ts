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
import { OverlayEventDetail } from "@ionic/core";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import { PaginaNavegacio } from "../../compartit/components/PaginaNavegacio";
import { StoreData } from "../../services/storage.data";
import {
  ICastellerModel,
  IDeuteModel,
  IUsuariModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { EventService } from "src/app/services/event.service";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";

import { DeviceService } from "src/app/services/device.service";

import { DeutesBs } from "src/app/business/deutes.business";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
@Component({
  selector: "fitxa-view",
  templateUrl: "fitxa.page.html",
  styleUrls: ["./fitxa.page.scss"],
})
export class FitxaPage extends PaginaNavegacio implements OnInit {
  public carregat: boolean = false;
  public user: IUsuariModel | null = null;
  public userLoad: boolean = false;
  public casteller: ICastellerModel | null = null;
  public adjunts: ICastellerModel[] = [];
  public personesACarrec: ICastellerModel[] = [];
  public solicituds: ICastellerModel[] = [];
  public invitacions: ICastellerModel[] = [];
  public aCarrecDe: ICastellerModel[] = [];
  constructor(
    httpClient: HttpClient,
    route: Router,
    navCtrl: NavController,
    usuariBs: UsuariBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected castellersBs: CastellersBs,
    protected deutesBs: DeutesBs,
    protected sincronitzarBs: SincronitzacioDBBs,
    protected deviceService: DeviceService,
    protected activatedRoute: ActivatedRoute,
    alertCtrl: AlertController,
    protected store: StoreData,
    protected modalCtrl: ModalController,
    protected actionSheetCtrl: ActionSheetController,
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
  async ngOnInit() {
    this.carregat = false;
    this.userLoad = false;
  }
  async onLoad() {
    this.carregat = true;
  }
  async ngAfterViewInit() {
    this.usuari = await this.usuariBs.obtenirUsuari();
    this.actualitzarCasteller(false);
  }
  public carregarFormulari() {
    this.adjunts = [];
    this.personesACarrec = [];
    this.solicituds = [];
    this.invitacions = [];
    this.aCarrecDe = [];

    if (this.user?.Delegats) {
      this.user.Delegats.forEach(async (idCasteller) => {
        this.aCarrecDe.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user?.SolicitutsEnviades) {
      this.user.SolicitutsEnviades.forEach(async (idCasteller) => {
        this.solicituds.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user?.Delegacions) {
      this.user.Delegacions.forEach(async (idCasteller) => {
        this.personesACarrec.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user?.SolicitutsRebudes) {
      this.user.SolicitutsRebudes.forEach(async (idCasteller) => {
        this.invitacions.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user?.Adjunts) {
      this.user.Adjunts.forEach(async (idCasteller) => {
        this.adjunts.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
  }
  /**
   * Carregar l'Informació de la pantalla al controller
   */
  async actualitzarCasteller(forcar: boolean) {
    try {
      this.casteller = await this.usuariBs.obtenirCasteller();
      if (forcar) {
        this.user = await this.usuariBs.obtenirUsuariActual();
        this.carregarFormulari();
      } else {
        this.user = await this.storeData.obtenirUsuari();
        this.usuariBs.obtenirUsuariActual().then((usr) => {
          this.user = usr;
          this.storeData.desarUsuari(this.user);
          this.carregarFormulari();
        });
      }
      this.userLoad = true;
    } catch (err) {
      this.user = await this.storeData.obtenirUsuari();
      this.carregarFormulari();
    }

    return this.casteller;
  }
  /**
   * Obrir Opcions de telefons
   * @param cas
   */
  async obrirOpcions(cas: ICastellerModel) {
    let actionSheet = this.actionSheetCtrl.create({
      header: "Contacta per",
      buttons: [
        {
          icon: "logo-whatsapp",
          text: "WhatsApp",
          handler: () => {
            window.open(
              `https://api.whatsapp.com/send?phone=34${cas.Telefon1}&text=Hola%20`,
              "_system"
            );
          },
        },
        {
          icon: "call-outline",
          text: "Telèfon",
          handler: () => {
            window.open(`tel:${cas.Telefon1}`, "_system");
          },
        },
        {
          icon: "mail-outline",
          text: "Email",
          handler: () => {
            window.open(`mailto:${cas.Email}`, "_system");
          },
        },
      ],
    });
    (await actionSheet).present();
  }

  /**
   * Obrir el telefon
   * @param telf
   */
  obrirTelefon(telf: string) {
    window.open(`tel:${telf}`, "_system");
  }

  /**
   * Obrir WhatsApp Web
   * @param telf
   */
  obrirWhatApp(telf: string) {
    window.open(
      `https://api.whatsapp.com/send?phone=34${telf}&text=Hola%20`,
      "_system"
    );
  }

  /**
   * Rebre Correus d'albums
   * @param rebre
   */
  async rebreCorreusFotos(rebre: boolean) {
    if (!this.deviceService.teConexio()) {
      if (!this.casteller) {
        console.error("Casteller no encontrado");
        return;
      }
      this.casteller.RebreCorreuFotos = !rebre;
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let t = await this.castellersBs.rebreEmailFotos(rebre);
    if (!t.Correcte) {
      this.presentarMissatge(t.Missatge, 3000);
    }
  }

  /**
   * Rebre Correus per Noticies
   * @param rebre
   */
  async rebreCorreusNoticies(rebre: boolean) {
    if (!this.deviceService.teConexio()) {
      if (!this.casteller) {
        console.error("Casteller no encontrado");
        return;
      }
      this.casteller.RebreCorreuNoticies = !rebre;
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let t = await this.castellersBs.rebreEmailNoticies(rebre);
    if (!t.Correcte) {
      this.presentarMissatge(t.Missatge, 3000);
    }
  }
  /**
   * Anar la la fitxa del casteller
   */
  anarACasteller() {
    //this.nav.push(CastellerDetPage, this.casteller);
  }

  /**
   * Esborrar un referenciat (o Minion) a l'usuari
   * @param casteller Casteller seleccionat per esborrar
   */
  async esborrarReferenciat(casteller: ICastellerModel) {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let confirmar = await this.presentarConfirmacioAccio(
      "esborrar",
      "el minion",
      null
    );
    if (confirmar) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant Informació",
        duration: 3000,
      });
      await loading.present();

      let c = await this.castellersBs.esborrarReferenciat(casteller);
      loading.dismiss();
      if (c.Correcte) {
        //ArrayUtils.removeElement(casteller, this.adjunts);
        this.actualitzarCasteller(true);
      } else this.presentarMissatgeError(c.Missatge);
    }
  }
  /**
   * Crear un referenciat o Minion a l'usuari
   * */
  async crearReferenciat() {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let modal = await this.modalCtrl.create({
      component: CastellersPopUp,
      componentProps: {
        rols: this.usuari?.Rols,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        const loading = await this.loadingCtrl.create({
          message: "Enviant Informació",
          duration: 3000,
        });
        await loading.present();

        let confirmar = await this.castellersBs.crearReferenciat(detail.data);
        loading.dismiss();
        if (confirmar.Correcte) {
          this.adjunts.push(detail.data);
          //this.actualitzarCasteller();
        } else this.presentarMissatgeError(confirmar.Missatge);
      }
    });
    modal.present();
  }
  /**
   * Envia solicitud de delegació per l'usuari conectat, sobre un PopUp de castellers
   */
  async enviaInvitacio() {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let modal = await this.modalCtrl.create({
      component: CastellersPopUp,
      componentProps: {
        rols: this.usuari?.Rols,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        const loading = await this.loadingCtrl.create({
          message: "Enviant Informació",
          duration: 3000,
        });
        await loading.present();
        let confirmar = await this.castellersBs.enviaInvitacio(detail.data);
        loading.dismiss();
        if (confirmar.Correcte) {
          this.solicituds.push(detail.data);
          //this.actualitzarCasteller();
        } else this.presentarMissatgeError(confirmar.Missatge);
      }
    });
    modal.present();
  }
  /**
   * Acceptar una invitació d'un altre casteller'
   * @param casteller Casteller que t'ha enviat la solicitud
   */
  async acceptarInvitacio(casteller: ICastellerModel) {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    const loading = await this.loadingCtrl.create({
      message: "Enviant Informació",
      duration: 3000,
    });
    await loading.present();
    let confirmar = await this.castellersBs.acceptarInvitacio(casteller);
    if (confirmar.Correcte) {
      await this.actualitzarCasteller(true);
    } else this.presentarMissatgeError(confirmar.Missatge);
    loading.dismiss();
  }

  /**
   * Esboora la acceptació ja realitzada.
   * @param casteller Casteller delegat a nosaltres
   */
  async esborrarPersonesACarrec(casteller: ICastellerModel) {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    if (!this.casteller) {
      console.error("El parametre casteller no esta assignat ");
      return;
    }
    let confirmar = await this.presentarConfirmacioAccio(
      "esborrar",
      "delegació",
      `No podrà confirmar assistència de ${casteller.Alias}`
    );
    if (confirmar) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant Informació",
        duration: 3000,
      });
      await loading.present();
      let c = await this.castellersBs.esborrarDelegacio(
        this.casteller,
        casteller
      );
      loading.dismiss();
      if (c.Correcte) {
        //ArrayUtils.removeElement(casteller, this.personesACarrec);
        await this.actualitzarCasteller(true);
      } else this.presentarMissatgeError(c.Missatge);
    }
  }

  async esborrarACarrecDe(casteller: ICastellerModel) {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    if (!this.casteller) {
      console.error("El parametre casteller no esta assignat ");
      return;
    }
    let confirmar = await this.presentarConfirmacioAccio(
      "esborrar",
      "delegació",
      null
    );
    if (confirmar) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant Informació",
        duration: 3000,
      });
      await loading.present();
      let c = await this.castellersBs.esborrarDelegacio(
        casteller,
        this.casteller
      );
      loading.dismiss();
      if (c.Correcte) {
        //ArrayUtils.removeElement(casteller, this.aCarrecDe);
        await this.actualitzarCasteller(true);
      } else this.presentarMissatgeError(c.Missatge);
    }
  }

  /**
   * Esborra la solicitud enviada per un altre casteller
   * @param casteller Castelller que ha enviat la solicitud
   */
  async esborrarSolicituds(casteller: ICastellerModel) {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let confirmar = await this.presentarConfirmacioAccio(
      "esborrar",
      "invitació",
      null
    );
    if (confirmar) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant Informació",
        duration: 3000,
      });
      await loading.present();
      let c = await this.castellersBs.esborrarSolicitud(casteller);
      loading.dismiss();
      if (c.Correcte) {
        // ArrayUtils.removeElement(casteller, this.invitacions);
        await this.actualitzarCasteller(true);
      } else this.presentarMissatgeError(c.Missatge);
    }
  }
  /**
   * Esborra la invitació enviada per un altre casteller
   * @param casteller Castelller que ha enviat la solicitud
   */
  async esborrarInvitacio(casteller: ICastellerModel) {
    if (!this.deviceService.teConexio()) {
      this.presentarSenseConexioOpcioBloquejada();
      return;
    }
    let confirmar = await this.presentarConfirmacioAccio(
      "esborrar",
      "invitació",
      null
    );
    if (confirmar) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant Informació",
        duration: 3000,
      });
      await loading.present();
      let c = await this.castellersBs.esborrarInvitacio(casteller);
      if (c.Correcte) {
        // ArrayUtils.removeElement(casteller, this.solicituds);
        await this.actualitzarCasteller(true);
      } else this.presentarMissatgeError(c.Missatge);
      loading.dismiss();
    }
  }
  infoMenor() {
    this.presentarAlerta(
      "Menor a càrrec",
      "Els menors estan protegits i no es poden esborrar."
    );
  }
  public async mostrarAlertaCanvi() {
    if (!this.casteller) {
      console.error("no existeix casteller assignat");
      return;
    }
    let alert = await this.alertCtrl.create({
      header: "Corregir",
      message: "Canvia el valors",
      inputs: [
        {
          name: "Nom",
          type: "text",
          value: this.casteller.Nom,
          placeholder: "Nom",
        },
        {
          name: "Cognom",
          type: "text",
          value: this.casteller.Cognom,
          placeholder: "Cognom",
        },
        {
          name: "Telefon1",
          type: "number",
          value: this.casteller.Telefon1,
          placeholder: "Telèfon",
        },
        {
          name: "Telefon2",
          type: "number",
          value: this.casteller.Telefon2,
          placeholder: "Telèfon Aux",
        },
        {
          name: "Direccio",
          type: "text",
          value: this.casteller.Direccio,
          placeholder: "Direcció",
        },
        {
          name: "CodiPostal",
          type: "text",
          value: this.casteller.CodiPostal,
          placeholder: "Codi postal",
        },
      ],
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Desar",
          handler: (data) => {
            if (!this.casteller) {
              console.error("no existeix casteller assignat");
              return;
            }
            this.casteller.Telefon1 = data.Telefon1;
            this.casteller.Telefon2 = data.Telefon2;
            this.casteller.CodiPostal = data.CodiPostal;
            this.casteller.Direccio = data.Direccio;
            this.casteller.Nom = data.Nom;
            this.casteller.Cognom = data.Cognom;
            this.usuariBs
              .enviarEmailConformacioDades(this.casteller)
              .then((t) => {
                this.presentarAlerta(
                  "Correu Enviat!",
                  "S'ha enviat un correo al responsable de dades en la colla. <br/> En breu es corretgiran."
                );
              });
          },
        },
      ],
    });
    await alert.present();
  }
}
