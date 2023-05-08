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

import { lastValueFrom } from 'rxjs';
import { Component, ViewChild, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  MenuController,
} from "@ionic/angular";
import { PaginaGenerica } from "../../compartit/components/PaginaGenerica";
import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import { UsuariService } from "src/app/services/usuari.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceService } from "../../services/device.service";
import { ErrorRefrescarCredencials } from "../../entities/Errors";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";

@Component({
  selector: "optimitzar.page",
  templateUrl: "optimitzar.page.html",
  styleUrls: ["./optimitzar.page.scss"],
})
export class OptimitzarPage extends PaginaNavegacio implements OnInit {
  text: string = "";
  public version: String | undefined;
  public visibleReintentar: boolean = false;
  public forçar: boolean = false;
  constructor(
    usuariBs: UsuariBs,
    protected router: Router,
    protected modalCtrl: ModalController,
    alertCtrl: AlertController,
    navCtrl: NavController,
    loadingCtrl: LoadingController,
    storeData: StoreData,
    protected menu: MenuController,
    protected usuariService: UsuariService,
    toastCtrl: ToastController,
    protected activatedRoute: ActivatedRoute,
    protected deviceService: DeviceService
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
    this.forçar = this.activatedRoute.snapshot.paramMap.get("force") != "false";
    //this.version = navCtrl.
    this.treballEnProces = true;
  }

  async ngOnInit() {
    this.treballEnProces = true;
  }
  async ionViewDidEnter() {
    //Comencem a versio
    try {
      let t = null; //await lastValueFrom(this.controlDeVersioService.checkVersio(this.deviceService.obtenirVersio()));
      if (t == null) {
        let v = await this.storeData.obtenirVersioDB();
        this.presentarAlerta(
          "Error",
          "El servidor no té registrada la versió " + v
        )
          .then((t) => {
            this.treballEnProces = false;
            this.navCtrl.pop();
          })
          .catch((err) => {
            this.treballEnProces = false;
            this.navCtrl.pop();
          });
      }/* else if (this.forçar) {
        this.text = "Actualitzant app mode forçat";
        this.refreshBaseDadesLocal(t.Versio);
      } else if (t.RequereixActualitzacio) {
        this.text = "L'aplicació requereix instal·lar-se una nova versió";
        this.presentarAlerta(
          "Requereix actualització",
          "L'aplicació requereix instal·lar-se una nova versió. Valida que al Market hi ha una versió disponible"
        );
      } else if (t.RequereixRefresc) {
        this.refreshBaseDadesLocal(t.Versio);
      } else {
        this.treballEnProces = false;
        this.storeData.desarVersioDB(t.Versio);
        this.navCtrl.pop();
      }*/
    } catch (exception) {
      this.text = "No hi ha accés a internet.";
      this.visibleReintentar = true;
    }
  }
  reintentar() {
    this.text = "";
    this.visibleReintentar = false;
    this.text = "Iniciant .....";
    setTimeout(() => {
      this.ngOnInit();
    }, 3000);
  }
  async refreshBaseDadesLocal(versioactual: number) {
    try {
      this.text = "Esborrant Cache";
      await this.storeData.cleanMemoria();
      this.text = "Validant credencials usuari";
      let user = await this.usuariBs.refrescarUsuari();
      this.text = "Actualitzant dades ...";
      /* await this.sincronitzacioDBBs.actualitzarPaquets(true);
    this.text = "Actualitzant Tipus Bàsics ...";
    await this.sincronitzacioDBBs.sobreescriureTipusBasics();
    if (this.usuariBs.esCasteller()) {
      this.text = "Actualitzant Castellers ...";
      await this.sincronitzacioDBBs.sobreescriureCastellers(); 
    }*/
      this.treballEnProces = false;
      this.navegarAInici();
    } catch (exception) {
      if (exception instanceof ErrorRefrescarCredencials) {
        this.presentarAlertaCredencialsCaducades();
        this.treballEnProces = false;
        this.navegarAIniciarSessio();
      } else {
        this.text = "Error " + exception;
        this.visibleReintentar = true;
      }
    }
  }
}
