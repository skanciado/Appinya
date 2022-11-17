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
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import {
  ToastController,
  AlertController,
  NavController,
  LoadingController,
} from "@ionic/angular";

import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import { Router } from "@angular/router";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { AuthenticateService } from "src/app/services/authenticate.service";
import { EventService } from "src/app/services/event.service";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { DeviceService } from "src/app/services/device.service";

@Component({
  selector: "perdrepassword-page",
  templateUrl: "perdrepassword.page.html",
  styleUrls: ["./perdrepassword.page.scss"],
})
/**
 * Controlador per la pantalla Perdre Password
 */
export class PerdrePasswordPage extends PaginaNavegacio implements OnInit {
  email: String = "";
  enviat = false;

  constructor(
    protected eventService: EventService,
    protected deviceService: DeviceService,
    protected usuariBs: UsuariBs,
    protected route: Router,
    protected navCtrl: NavController,
    protected toastCtrl: ToastController,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected storeData: StoreData,
    protected authenticateService: AuthenticateService,
    private faio: FingerprintAIO
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
  /**
   * Carregar Pagina Principal
   * */
  ngOnInit() {}

  /**
   * Boto Login
   * @param form
   */
  async onLogin(form: NgForm) {
    if (!this.deviceService.teConexio()) {
      this.presentarMissatgeAmbConexio();
      return;
    }
    this.enviat = true;

    let loading = await this.presentarCarregant(
      "Validant credencials al servidor"
    );
    loading.present();
    this.authenticateService.oblidarConstrasenya(this.email).subscribe(
      (tk) => {
        loading.dismiss();
        this.navegarAEnrera();
        this.presentarAlerta(
          "Comunicació enviada",
          `T'hen enviat un correo a ${this.email} per confirmar i canviar el password de la compte`
        );
      },
      (err) => {
        console.info(err);
        loading.dismiss();
        this.presentarAlerta(
          "Error en la comunicació",
          "Hem tingut un problema en l'enviament del correu, torni a intentar-ho en breu."
        );
      }
    );
  }
}
