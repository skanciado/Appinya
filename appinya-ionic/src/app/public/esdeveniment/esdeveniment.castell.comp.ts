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
import { OverlayEventDetail } from "@ionic/core";
import { Component, ViewChild, OnInit, ElementRef, Input } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { PaginaNavegacio } from "../../compartit/components/PaginaNavegacio";
import { StoreData } from "../../services/storage.data";
import {
  IEntitatHelper,
  IEsdevenimentCastellModel,
  IEsdevenimentDetallFormModel,
  IEsdevenimentDetallModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { EventService } from "src/app/services/event.service";
import { CastellPopUp } from "./castell.popup";
@Component({
  selector: "esdeveniment-castell-comp",
  templateUrl: "esdeveniment.castell.comp.html",
  styleUrls: ["./esdeveniment.castell.comp.scss"],
})
export class EsdevenimentCastellComponent
  extends PaginaNavegacio
  implements OnInit
{
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
    protected route: Router,
    protected navCtrl: NavController,
    protected usuariBs: UsuariBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected castellersBs: CastellersBs,
    protected activatedRoute: ActivatedRoute,
    protected alertCtrl: AlertController,
    protected store: StoreData,
    protected modalCtrl: ModalController,
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
  castells: Array<{
    Castell: IEsdevenimentCastellModel;
    TipusCastell: IEntitatHelper;
    EstatCastell: IEntitatHelper;
  }> = [];
  /**
   * Funcion inici
   * */
  async ngOnInit() {}
  @Input()
  set esdeveniment(esdeveniment: IEsdevenimentDetallFormModel) {
    this.refrescar(esdeveniment);
  }
  /**
   * Refrescar Formulari
   * @param esdeveniment
   */
  async refrescar(esdeveniment: IEsdevenimentDetallModel) {
    this.castells = [];
    let tipusCastell = await this.storeData.obtenirTipusCastell();

    let tipusProva = await this.storeData.obtenirTipusProves();
    let tipusEstats = await this.storeData.obtenirTipusEstatCastell();

    esdeveniment.Castells.forEach((castell) => {
      let tipus = tipusCastell.find((t) => t.Id == castell.IdTipusCastell);

      let estat = tipusEstats.find((t) => t.Id == castell.IdEstatCastell);
      let prova = false;
      if (!tipus) {
        tipus = tipusProva.find((t) => t.Id == castell.IdTipusCastell);
        prova = true;
      }
      this.castells.push({
        Castell: castell,
        TipusCastell: tipus,
        EstatCastell: estat,
      });
    });
  }
  /**
   *
   * @param castell
   */
  async editarCastell(castell) {
    let modal = await this.modalCtrl.create({
      component: CastellPopUp,
      componentProps: {
        idEsdeveniment: castell.Castell.IdEsdeveniment,
        castell: castell.Castell,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        castell = detail.data;
      }
    });
    modal.present();
  }
  /**
   * Destruir component
   */
  ngOnDestroy() {
    this.castells = [];
  }
}
