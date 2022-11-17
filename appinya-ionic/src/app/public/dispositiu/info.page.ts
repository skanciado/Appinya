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

import { Component, OnInit } from "@angular/core";

import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
} from "@ionic/angular";

import { OverlayEventDetail } from "@ionic/core";
import { StoreData } from "../../services/storage.data";
import { environment } from "../../../environments/environment";
import { DeviceService } from "../../services/device.service";
import { UsuariBs } from "../../business/Usuari.business";
import { Router } from "@angular/router";
import { UsuariService } from "../../services/usuari.service";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
import { AdministradorService } from "src/app/services/administrador.service";
@Component({
  selector: "info-device",
  templateUrl: "info.page.html",
  styleUrls: ["./info.page.scss"],
})
export class InfoPage extends PaginaNavegacio implements OnInit {
  versio: number;
  plataforma: string;
  dataActualitzacio: string;
  servidor: string;
  token: String;
  refresh: string;
  rols: string;
  castellers: number;
  esdeveniments: number;
  tipusesdeveniments: number;
  tipusposicions: number;
  dataActualitzacioTipus: string;
  user: string;
  tokenObject: string;
  constructor(
    protected deviceService: DeviceService,
    protected usuariBs: UsuariBs,
    protected route: Router,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected toastCtrl: ToastController,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected storeData: StoreData,
    protected usuariService: UsuariService,
    protected administradorService: AdministradorService
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
  /**Carregar Pagina Principal */
  async ngOnInit() {
    this.versio = this.deviceService.obtenirVersio();
    this.plataforma = this.deviceService.obtenirPlataformes();
    this.dataActualitzacio = await this.storeData.obtenirDataActualitzacio();
    this.servidor = environment.UrlServidor;
    this.token = await this.storeData.obtenirToken();
    this.refresh = "";
    this.rols = (await this.storeData.obtenirUsuari()).Rols.join(",");
    this.castellers = (await this.storeData.obtenirCastellers()).length;
    this.esdeveniments = (
      await this.storeData.obtenirEsdeveniments()
    ).Values().length;
    this.tipusesdeveniments = (
      await this.storeData.obtenirTipusEsdeveniments()
    ).length;
    this.tipusposicions = (await this.storeData.obtenirTipusPosicions()).length;
    this.user = JSON.stringify(await this.storeData.obtenirUsuariSession());
    this.tokenObject = JSON.stringify(this.storeData.obtenirToken());
  }
  canviarServidor() {
    environment.UrlServidor = this.servidor;
    environment.UrlServidorAutentificacion = this.servidor;
    this.presentarMissatge("S'ha canviat el servidor " + this.servidor, 6000);
  }
  ionViewDidEnter() {}
  forcarRefresc() {
    this.navegarARefresc();
  }
  async subplantar() {
    let modal = await this.modalCtrl.create({
      component: CastellersPopUp,
      componentProps: {
        rols: this.usuari.Rols,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        let local = await this.storeData.obtenirUsuariSession();
        this.administradorService
          .subplantarIdentidat(detail.data, local)
          .subscribe(
            (user) => {
              this.storeData.cleanMemoria();
              this.storeData.desarUsuariSessio(user);
              this.navegarARefresc();
            },
            (error) => {
              this.presentarMissatgeError(error.Missatge);
            }
          );
      }
    });
    modal.present();
  }
}
