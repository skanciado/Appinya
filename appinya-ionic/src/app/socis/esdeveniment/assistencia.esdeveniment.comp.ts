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
  IAssistenciaDetallForm,
  IEsdevenimentDetallFormModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { EventService } from "src/app/services/event.service";
import { AssistenciaCastellersPopUp } from "../assistencia/assistenciaCastellers.popup";
import { AssistenciaCastellerGrupPopUp } from "../assistencia/assistenciaCastellersGrup.popup";
@Component({
  selector: "assistencia-esdeveniment-comp",
  templateUrl: "assistencia.esdeveniment.comp.html",
  styleUrls: ["./assistencia.esdeveniment.comp.scss"],
})
export class AssistenciaEsdevenimentComponent
  extends PaginaNavegacio
  implements OnInit {
  public assistencia: IAssistenciaDetallForm | null = null;
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
  esdevenimentDetall: IEsdevenimentDetallFormModel | undefined;
  /**
   * Funcion inici
   * */
  async ngOnInit() { }
  @Input()
  set esdeveniment(esdeveniment: IEsdevenimentDetallFormModel) {
    this.esdevenimentDetall = esdeveniment;
    this.assistencia = {
      Delegacions: [],
      Adjunts: [],
      Assitiran: [],
      AssisteixenCanalla: 0,
      AssisteixenPinya: 0,
      AssisteixenTronc: 0,
      AssisteixenMusics: 0,
      AssisteixenSense: 0,
      NoAssisteixenCanalla: 0,
      NoAssisteixenPinya: 0,
      NoAssisteixenTronc: 0,
      NoAssisteixenMusics: 0,
      NoAssisteixenSense: 0,
      AssisteixenSanitaris: 0,
      NoAssisteixenSanitaris: 0,
      AssisteixenMusicsMix: 0,
      AssisteixenPinyaMix: 0,
      Acompanyants: 0,
      NoAssitiran: [],
    };
    this.esdevenimentBs
      .carregarAssitenciaAEsdevenimentFormulari(esdeveniment, this.assistencia)
      .then((t) => {
        console.log("Assistència carregada correctament ");
      });
  }
  refrescar(esdeveniment: IEsdevenimentDetallFormModel) {
    this.assistencia = {
      Delegacions: [],
      Adjunts: [],
      Assitiran: [],
      AssisteixenCanalla: 0,
      AssisteixenPinya: 0,
      AssisteixenTronc: 0,
      AssisteixenMusics: 0,
      AssisteixenSense: 0,
      NoAssisteixenCanalla: 0,
      NoAssisteixenPinya: 0,
      NoAssisteixenTronc: 0,
      NoAssisteixenMusics: 0,
      NoAssisteixenSense: 0,
      AssisteixenSanitaris: 0,
      NoAssisteixenSanitaris: 0,
      AssisteixenMusicsMix: 0,
      AssisteixenPinyaMix: 0,
      Acompanyants: 0,
      NoAssitiran: [],
    };
    this.esdevenimentBs
      .carregarAssitenciaAEsdevenimentFormulari(esdeveniment, this.assistencia)
      .then((t) => {
        console.log("Assistència carregada correctament ");
      });
  }
  ngOnDestroy() {
    this.assistencia = null;
  }
  async obrirAssistencia() {
    let modal = await this.modalCtrl.create({
      component: AssistenciaCastellersPopUp,
      componentProps: {
        id: this.esdevenimentDetall!.Id,
        detall: this.esdevenimentDetall,
      },
    });
    modal.present();
  }
  async obrirAssistenciaGrup() {
    let modal = await this.modalCtrl.create({
      component: AssistenciaCastellerGrupPopUp,
      componentProps: {
        id: this.esdevenimentDetall!.Id,
        detall: this.esdevenimentDetall,
      },
    });
    modal.present();
  }
}
