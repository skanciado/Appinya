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
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { UsuariBs } from "src/app/business/Usuari.business";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { ICastellerModel } from "src/app/entities/interfaces";
import { DeviceService } from "src/app/services/device.service";
import { EventService } from "src/app/services/event.service";
import { StoreData } from "src/app/services/storage.data";

@Component({
  selector: "app-public",
  templateUrl: "./opcions.page.html",
  styleUrls: ["./opcions.page.scss"],
})
export class OpcionsPage extends PaginaNavegacio implements OnInit {
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
  casteller: ICastellerModel | undefined;

  async ngOnInit() {
    this.casteller = await this.usuariBS.obtenirCasteller();
  }
  accedir() {
    this.presentarMissatge("aaaaa", 3000);
  }
  organitzacio() {
    this.navegarAOrganitzacio();
  }
  sortir() {
    this.storeData.desarUsuariSessio(null);
    this.storeData.cleanMemoria();
    this.navegarAIniciarSessio();
  }
  assitenciaPersonal() {
    this.navegarAAssistenciaCasteller("0");
  }
  anuncis() {
    this.navegarAAnuncis();
  }
  calendari() {
    this.navegarAAgenda();
  }
  fotos() {
    this.navegarAAlbums();
  }
  confirmacio() {
    this.navegarAConfirmacio();
  }
  fitxaUsuari() {
    this.navegarAFitxaUsuari();
  }
  accedirABustia() {
    this.navegarABustia();
  }
  incidencia() {
    this.navegarAIncidencia();
  }
}
