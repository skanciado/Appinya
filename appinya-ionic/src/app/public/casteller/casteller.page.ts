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
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { EventService } from "src/app/services/event.service";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";

import { DeviceService } from "src/app/services/device.service";

import { DeutesBs } from "src/app/business/deutes.business";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { RolsPopUp } from "src/app/compartit/popups/rols.popup";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
@Component({
  selector: "casteller-view",
  templateUrl: "casteller.page.html",
  styleUrls: ["./casteller.page.scss"],
})
export class CastellerPage extends PaginaNavegacio implements OnInit {
  public carregat: boolean = false;
  public id: string;
  public user: IUsuariModel;
  public userLoad: boolean;
  public casteller: ICastellerModel;
  public adjunts: ICastellerModel[] = [];
  public referents: ICastellerModel[] = [];
  public personesACarrec: ICastellerModel[] = [];
  public solicituds: ICastellerModel[] = [];
  public invitacions: ICastellerModel[] = [];
  public aCarrecDe: ICastellerModel[] = [];
  public deutes: IDeuteModel[];
  @ViewChild("carregant") carregant: CarregantLogoComponent;
  constructor(
    protected httpClient: HttpClient,
    protected route: Router,
    protected navCtrl: NavController,
    protected usuariBs: UsuariBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected castellersBs: CastellersBs,
    protected deutesBs: DeutesBs,
    protected sincronitzarBs: SincronitzacioDBBs,
    protected deviceService: DeviceService,
    protected activatedRoute: ActivatedRoute,
    protected alertCtrl: AlertController,
    protected store: StoreData,
    protected modalCtrl: ModalController,
    protected actionSheetCtrl: ActionSheetController,
    protected loadingCtrl: LoadingController,
    protected toastCtrl: ToastController,
    protected storeData: StoreData,
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
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    this.carregat = false;
    this.userLoad = false;
  }
  async onLoad(cas: any) {
    this.casteller = cas;
    this.carregat = true;
  }
  async ngAfterViewInit() {
    this.usuari = await this.usuariBs.obtenirUsuari();
    this.carregant.carregarPromise(this.actualitzarCasteller(false));
  }
  public carregarFormulari() {
    this.adjunts = [];
    this.referents = [];
    this.personesACarrec = [];
    this.solicituds = [];
    this.invitacions = [];
    this.aCarrecDe = [];

    if (!this.user || this.user.Id == null) return;
    if (this.user?.Delegats?.length > 0) {
      this.user.Delegats.forEach(async (idCasteller) => {
        this.aCarrecDe.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user.SolicitutsEnviades?.length > 0) {
      this.user.SolicitutsEnviades.forEach(async (idCasteller) => {
        this.solicituds.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user.Delegacions?.length > 0) {
      this.user.Delegacions.forEach(async (idCasteller) => {
        this.personesACarrec.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user.SolicitutsRebudes?.length > 0) {
      this.user.SolicitutsRebudes.forEach(async (idCasteller) => {
        this.invitacions.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user.Adjunts?.length > 0) {
      this.user.Adjunts.forEach(async (idCasteller) => {
        this.adjunts.push(
          await this.castellersBs.obtenirCasteller(idCasteller)
        );
      });
    }
    if (this.user.Referents?.length > 0) {
      this.user.Referents.forEach(async (idCasteller) => {
        this.referents.push(
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
      if (this.id != "0") {
        this.casteller = await this.castellersBs.obtenirCasteller(this.id);

        if (this.isAdmin() || this.isSecretari()) {
          if (this.casteller.Email)
            this.user = await this.usuariBs.obtenirUsuariPerEmail(
              this.casteller.Email
            );

          this.carregarFormulari();
        }

        if (
          this.isJunta() ||
          this.isAdmin() ||
          this.isSecretari() ||
          this.isTresorer()
        ) {
          this.deutes =
            (await this.deutesBs.obtenirDeutesPerCasteller(this.casteller)) ||
            [];
        }
      } else {
        this.casteller = await this.usuariBs.obtenirCasteller();
        if (forcar) {
          this.user = await this.usuariBs.obtenirUsuariActual();
        } else {
          this.user = await this.storeData.obtenirUsuari();
          this.usuariBs.obtenirUsuariActual().then((usr) => {
            this.user = usr;
            this.storeData.desarUsuari(this.user);
            this.carregarFormulari();
          });
        }
        this.userLoad = true;
        this.deutes = await this.deutesBs.obtenirDeutesUsuari();
      }
    } catch (err) {
      this.deutes = [];
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
          text: "WhatApp",
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
   * Crear Usuari
   */
  async crearUsuari() {
    const loading = await this.loadingCtrl.create({
      message: "Enviant Informació",
      duration: 3000,
    });
    await loading.present();
    let r = await this.usuariBs.crearUsuari(this.casteller);
    if (!r.Correcte) {
      this.presentarMissatgeError(r.Missatge);
    } else {
      await this.actualitzarCasteller(true);
    }
    loading.dismiss();
  }
  /**
   * Obrir Popup de Rols
   */
  async obrirRols() {
    let modal = await this.modalCtrl.create({
      component: RolsPopUp,
      componentProps: {
        rols: this.user.Rols,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        const loading = await this.loadingCtrl.create({
          message: "Enviant Informació",
          duration: 3000,
        });
        await loading.present();
        let r = await this.usuariBs.desarRols(this.user.Email, detail.data);
        loading.dismiss();
        this.user.Rols = detail.data;
      }
    });
    modal.present();
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

  veureAssistencia() {
    this.navegarAAssistenciaCasteller(this.casteller.Id);
  }
  /**
   * Editar Castellers
   */
  editCasteller() {
    this.navegarAEditarCasteller(this.casteller.Id);
  }
  /**
   * Editar Dades Tecniques
   */
  editarDadesTecniques() {
    this.navegarAEditarDadesTecniques(this.casteller.Id);
  }
  /**
   * Esborrar un referenciat (o Minion) a l'usuari
   * @param casteller Casteller seleccionat per esborrar
   */
  async esborrarReferenciat(casteller: ICastellerModel) {
    let confirmar = await this.presentarConfirmacioAccio(
      "esborrar",
      "el minion",
      null
    );
    if (confirmar) {
      let c = await this.castellersBs.esborrarReferenciat(casteller);
      if (c.Correcte) {
        //ArrayUtils.removeElement(casteller, this.adjunts);
        this.actualitzarCasteller(true);
      } else this.presentarMissatgeError(c.Missatge);
    }
  }
}
