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
  selector: "incidencia-page",
  templateUrl: "incidencia.page.html",
  styleUrls: ["./incidencia.page.scss"],
})
export class IncidenciaPage extends PaginaNavegacio implements OnInit {
  conexio: boolean = true;
  submitted: boolean = false;
  supportMessage: string = "";
  tema: string = "";
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
      let loading = await this.presentarCarregant("Enviant de l'incidència ");
      loading.present();

      let resposta = await this.usuariBS.enviarEmailComisio(
        "6",
        `esEntornWeb:${this.deviceService.esEntornWeb()} <br/>
         Plataforma:${this.deviceService.obtenirPlataformes()} <br/>
         esPantallaGran:${this.deviceService.esPantallaGran()} <br/>
         esConexioActiva:${this.deviceService.esConexioActiva()} <br/>
         ${this.tema} <br> ${this.supportMessage}`
      );

      this.presentarMissatge(
        "S'ha enviat la notificació a l'equip de suport.",
        3000
      );

      loading.dismiss();

      this.supportMessage = "";
      this.submitted = false;
      this.tema = "";
      this.navegarAEnrera();
    }
  }
  obrirPaginaAdministracio() {
    if (this.contador > 5) this.navCtrl.navigateBack("/public/dispositiu");
    this.contador++;
  }
}
