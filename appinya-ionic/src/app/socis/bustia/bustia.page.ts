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
  AlertController,
  NavController,
  ToastController,
  LoadingController,
} from "@ionic/angular";

import { UsuariBs } from "../../business/Usuari.business";
import { Router } from "@angular/router";
import { StoreData } from "../../services/storage.data";
import { UsuariService } from "../../services/usuari.service";
import { DeviceService } from "../../services/device.service";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
@Component({
  selector: "bustia-page",
  templateUrl: "bustia.page.html",
  styleUrls: ["./bustia.page.scss"],
})
export class BustiaPage extends PaginaNavegacio implements OnInit {
  conexio: boolean = false;
  submitted: boolean = false;
  supportMessage: string = "";
  qui: string = "";
  contador: number = 0;
  version: String = "";
  constructor(
    usuariBs: UsuariBs,
    route: Router,
    navCtrl: NavController,
    toastCtrl: ToastController,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    storeData: StoreData,
    protected usuariService: UsuariService,
    protected deviceService: DeviceService
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
  ngOnInit() {
    this.conexio = this.deviceService.teConexio();
  }

  async submit(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      let loading = await this.presentarCarregant("Enviant el suggeriment ");
      loading.present();

      let resposta = await this.usuariBS.enviarEmailComisio(
        this.qui,
        this.supportMessage
      );
      if (resposta!.Correcte) {
        this.presentarMissatge("S'ha enviat la notificació a l'equip.", 3000);
      } else {
        this.presentarAlerta(
          "No hi ha Organització",
          "No s'ha enviat perquè l'organització no està definida"
        );
      }

      loading.dismiss();

      this.supportMessage = "";
      this.submitted = false;
      this.qui = "";
      this.navegarAEnrera();
    }
  }
  obrirPaginaAdministracio() {
    if (this.contador > 5) this.navCtrl.navigateBack("/public/dispositiu");
    this.contador++;
  }
}
