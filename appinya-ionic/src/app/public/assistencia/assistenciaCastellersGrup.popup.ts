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

import { Component, ViewChild, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  NavParams,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import {
  IAssistenciaModelList,
  ICastellerModel,
  IEsdevenimentDetallModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";

import { OverlayEventDetail } from "@ionic/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { PosicionsPopUp } from "src/app/compartit/popups/posicions.popup";
@Component({
  selector: "assistenciaCastellersGrup",
  templateUrl: "assistenciaCastellersGrup.popup.html",
  styleUrls: ["./assistenciaCastellersGrup.popup.scss"],
})
export class AssistenciaCastellerGrupPopUp
  extends PaginaLlista
  implements OnInit
{
  bmostraCerca: boolean = false;
  queryText: string = "";
  id: string;
  tipusCerca: string = "assistents";
  esdevenimentDetall: IEsdevenimentDetallModel;
  @ViewChild("textCerca") textCerca: any;
  @ViewChild("carregant") carregant: CarregantLogoComponent;

  posicionsFiltre: any[] = [];
  constructor(
    protected usuariBs: UsuariBs,
    protected esdevenimentBS: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    protected navParams: NavParams,
    protected activatedRoute: ActivatedRoute,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected device: DeviceService,
    protected toastCtrl: ToastController,
    protected modalController: ModalController
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
    this.tipusCerca = "assistents";
    this.bmostraCerca = false;
  }
  /**
   * Metode al entrar al formulari
   * */
  async ngOnInit() {
    this.tipusCerca = "assistents";
    this.bmostraCerca = false;
    this.id = this.navParams.get("id");
    //this.id = this.activatedRoute.snapshot.paramMap.get("id");
    //this.canviarCerca();
  }
  /**
   * Despres de incializar la part grafica
   */
  ngAfterViewInit() {
    this.tipusCerca = "assistents";
    this.bmostraCerca = false;
    this.id = this.navParams.get("id");
    this.carregant.carregarPromise(this.canviarCerca());
  }
  /**
   * Obtenir/actualitzar Assistencia segons seleccio de usuari
   */
  private async obtenirAssitencia(): Promise<any> {
    let list: ICastellerModel[] = [];

    if (this.tipusCerca == "assistents") {
      list = (
        await this.esdevenimentBS.obtenirCastellersAssistents(
          this.esdevenimentDetall,
          this.queryText,
          this.posicionsFiltre
        )
      ).map((t) => t.casteller);
    } else if (this.tipusCerca == "noassistents") {
      list = (
        await await this.esdevenimentBS.obtenirCastellersNoAssistents(
          this.esdevenimentDetall,
          this.queryText,
          this.posicionsFiltre
        )
      ).map((t) => t.casteller);
    } else {
      list = await this.esdevenimentBS.obtenirCastellersPdtConfirmar(
        this.esdevenimentDetall,
        this.queryText,
        this.posicionsFiltre
      );
    }
    let grupsCastellers: Array<{
      nom: string;
      IdPosicio: string;
      castellers: ICastellerModel[];
    }> = [];

    let posicions = await this.storeData.obtenirTipusPosicions();
    posicions.forEach((p) => {
      let i: number = this.posicionsFiltre.findIndex((t) => {
        return p.Id == t;
      });
      // Si la posicion està en el filtro
      if (this.posicionsFiltre.length == 0 || i >= 0) {
        let castellersGrup: ICastellerModel[] = list.filter((cas) => {
          let find: number = cas.Posicions.findIndex((pos) => {
            return "" + pos.IdPosicio == p.Id;
          });
          if (find >= 0) {
            return true;
          } else {
            return false;
          }
        });
        if (castellersGrup && castellersGrup.length > 0)
          grupsCastellers.push({
            nom: p.Descripcio,
            IdPosicio: p.Id,
            castellers: castellersGrup,
          });
      }
    });
    // Grup Sense Posicio
    let castellersGrup: ICastellerModel[] = list.filter((cas) => {
      let find: number = cas.Posicions.length;
      if (find == 0) {
        return true;
      } else return false;
    });
    grupsCastellers.push({
      nom: "Sense Posició",
      IdPosicio: "99",
      castellers: castellersGrup,
    });
    return grupsCastellers;
  }
  public async canviarTipusParticipants() {
    this.actualitzarLlista(await this.obtenirAssitencia());
  }
  /**
   *  Funcio d'actualitzar el llistat
   */
  async actualitar() {
    const r1 = await this.sincronitzacioDBBs.actualitzarPaquets();
    this.esdevenimentDetall =
      await this.esdevenimentBS.obtenirEsdevenimentDetallModel(
        this.esdevenimentDetall.Id
      );
    this.actualitzarLlista(await this.obtenirAssitencia());
  }
  /**
   * canvi de cerca o reset de la llista
   */
  async canviarCerca() {
    this.esdevenimentDetall =
      await this.esdevenimentBS.obtenirEsdevenimentDetallModelStored(this.id);
    this.iniciarLlista(
      await this.obtenirAssitencia(),
      this.actualitar,
      null,
      10
    );
  }

  mostrarCerca() {
    if (!this.bmostraCerca) {
      this.bmostraCerca = true;
      setTimeout(() => {
        this.textCerca.setFocus();
      }, 150);
    } else {
      if (this.queryText != "") {
        this.queryText = "";
        this.canviarCerca();
        this.bmostraCerca = false;
      }
    }
  }
  amagarCerca() {
    if (this.queryText == "") this.bmostraCerca = false;
  }
  /**
   * Cerca de text
   * @param event
   */
  async cercarText(event) {
    if (this.queryText.length != 0 && this.queryText.length < 3) return;
    this.actualitzarLlista(await this.obtenirAssitencia());
  }
  /**
   * Metode de Presentacio de PopUp de filtres
   * */
  async presentFilter() {
    let modal = await this.modalCtrl.create({
      component: PosicionsPopUp,
      componentProps: { tipusInclos: this.posicionsFiltre },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        this.posicionsFiltre = detail.data;
        this.actualitzarLlista(await this.obtenirAssitencia());
      }
    });
    modal.present();
  }
  public cancelar() {
    this.modalController.dismiss(null);
  }
}
