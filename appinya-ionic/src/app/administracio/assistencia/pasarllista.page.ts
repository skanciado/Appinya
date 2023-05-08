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
  IonItemSliding,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import {
  IAssistenciaModel,
  ICastellerModel,
  IEsdevenimentDetallModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { OverlayEventDetail } from "@ionic/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { PosicionsPopUp } from "src/app/compartit/popups/posicions.popup";
import { ArrayUtils } from "src/app/utils/ArrayUtils";
import { EventService } from "src/app/services/event.service";
import { ErrorSenseInternet } from "src/app/entities/Errors";
interface IPassarListaModel {
  casteller: ICastellerModel;
  assistencia: IAssistenciaModel;
  delete: boolean;
}
@Component({
  selector: "pasarllista-page",
  templateUrl: "pasarllista.page.html",
  styleUrls: ["./pasarllista.page.scss"],
})
export class PasarLlistaPage extends PaginaLlista implements OnInit {
  @ViewChild("textCerca") textCercaComponent: any;
  @ViewChild("carregant") carregant: CarregantLogoComponent | undefined;
  @ViewChild("lista") lista: IonItemSliding | undefined;
  bmostraCerca: boolean = false;
  bpotConfirmar: boolean = false;
  queryText: string = "";
  tipusCerca: string = "assistents";
  esdevenimentDetall: IEsdevenimentDetallModel | undefined;
  posicionsFiltre: string[] = [];
  id: string = "";
  // grupsCastellers: Array<{ nom: string, icon: string, castellers: Casteller[] }> = [];

  constructor(
    usuariBs: UsuariBs,
    protected esdevenimentBS: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    navCtrl: NavController,
    storeData: StoreData,
    protected device: DeviceService,
    toastCtrl: ToastController,
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
    let wid = this.activatedRoute.snapshot.paramMap.get("id");
    if (wid)
      this.id = wid;
    else
      console.error("No existe el Id");

  }
  /**
   * Despres de incializar la part grafica
   */
  ngAfterViewInit() {
    this.tipusCerca = "assistents";
    this.bmostraCerca = false;
    let wid = this.activatedRoute.snapshot.paramMap.get("id");
    if (wid)
      this.id = wid;
    else
      console.error("No existe el Id");
    this.carregant!.carregarPromise(this.canviarCerca());
  }
  /**
   * Boto per mostar el textbox de cerca
   */
  mostrarCerca() {
    if (!this.bmostraCerca) {
      this.bmostraCerca = true;
      setTimeout(() => {
        this.textCercaComponent.setFocus();
      }, 150);
    } else {
      if (this.queryText != "") {
        this.queryText = "";
        this.canviarCerca();
        this.bmostraCerca = false;
      }
    }
  }
  /**
   * Amagar la cerca
   */
  amagarCerca() {
    if (this.queryText == "") this.bmostraCerca = false;
  }
  /**
   * Cerca de text
   * @param event
   */
  async cercarText(event: any) {
    if (this.queryText.length != 0 && this.queryText.length < 3) return;
    this.actualitzarLlista(await this.obtenirElements());
  }
  /**
   * Metode actualitzacio
   * */
  async actualitar() {
    const r1 = await this.sincronitzacioDBBs.actualitzarPaquets();
    this.esdevenimentDetall =
      await this.esdevenimentBS.obtenirEsdevenimentDetallModel(this.id);
    this.actualitzarLlista(await this.obtenirElements());
  }
  public async canviarTipusParticipants() {
    this.sincronitzacioDBBs.actualitzarPaquets().then(async (t) => {
      let esd = await this.esdevenimentBS.obtenirEsdeveniment(this.id);
      if (esd!.DataActualitzacio != this.esdevenimentDetall!.DataActualitzacio) {
        this.esdevenimentDetall =
          await this.esdevenimentBS.obtenirEsdevenimentDetallModel(this.id);
        this.actualitzarLlista(await this.obtenirElements());
      }
    });
    this.actualitzarLlista(await this.obtenirElements());
  }
  /**
   * Obtenir/actualitzar Assistencia segons seleccio de usuari
   */
  private async obtenirElements(): Promise<IPassarListaModel[]> {
    if (this.tipusCerca == "assistents") {
      return (
        await this.esdevenimentBS.obtenirCastellersAssistencia(
          this.esdevenimentDetall!.CastellersAssitiran || [],
          this.queryText,
          this.posicionsFiltre
        )
      ).map((t) => {
        return {
          casteller: t.casteller,
          assistencia: t.assistencia,
          delete: false,
        };
      });
    } else if (this.tipusCerca == "noassistents") {
      return (
        await this.esdevenimentBS.obtenirCastellersAssistencia(
          this.esdevenimentDetall!.CastellersNoAssitiran || [],
          this.queryText,
          this.posicionsFiltre
        )
      ).map((t) => {
        return {
          casteller: t.casteller,
          assistencia: t.assistencia,
          delete: false,
        };
      });
    } else {
      return (
        await this.esdevenimentBS.obtenirCastellersPdtConfirmar(
          this.esdevenimentDetall!,
          this.queryText,
          this.posicionsFiltre
        )
      ).map((t) => {
        return {
          casteller: t,
          assistencia: {
            Casteller: t.Id,
            ConfirmacioTecnica: false,
            Esdeveniment: this.esdevenimentDetall!.Id,
            Preguntes: [],
            DataModificacio: new Date()
          },
          delete: false,
        };
      });
    }
  }

  /**
   * Metode per indicar la no assistencia negativa d'un casteller
   * @param cas Entitat associada a la confirmació d'assistencia
   */
  noAssistir(cas: IPassarListaModel) {
    if (!this.device.esConexioActiva()) console.info("noAssistir");
    cas.assistencia.Assistire = false;
    cas.assistencia.ConfirmacioTecnica = true;
    this.assistenciaBs
      .confirmacioTecnica(this.esdevenimentDetall!.Id, [cas.assistencia])
      .then((t) => {
        if (t.Correcte == false) {
          this.presentarMissatgeError(t.Missatge);
        }
      })
      .catch((e) => {
        console.error(e);
        if (e instanceof ErrorSenseInternet) {
          this.presentarMissatgeSenseConexio();
        } else this.presentarMissatgeError(e);
      });
    this.lista!.closeOpened();
  }
  /**
   * Metode per indicar la no assistencia negativa d'un casteller
   * @param cas Entitat associada a la confirmació d'assistencia
   */
  assistir(cas: IPassarListaModel) {
    console.info("noAssistir");
    cas.assistencia.Assistire = true;
    cas.assistencia.ConfirmacioTecnica = true;
    this.assistenciaBs
      .confirmacioTecnica(this.esdevenimentDetall!.Id, [cas.assistencia])
      .then((t) => {
        if (t.Correcte == false) {
          this.presentarMissatgeError(t.Missatge);
        }
      })
      .catch((e) => {
        console.error(e);
        if (e instanceof ErrorSenseInternet) {
          this.presentarMissatgeSenseConexio();
        } else this.presentarMissatgeError(e);
      });
    this.lista!.closeOpened();
  }

  /**
   * Movimert de passar llista
   * @param event
   * @param cas
   */
  onDrag(event: any, cas: IPassarListaModel) {
    event.target.getSlidingRatio().then((res: any) => {
      if (res == -1) {
        if (this.tipusCerca == "assistents") {
          cas.delete = true;
          this.noAssistir(cas);
          this.eliminarElement(cas);
        } else if (this.tipusCerca == "noassistents") {
          this.noAssistir(cas);
        } else {
          cas.delete = true;
          this.noAssistir(cas);
          this.eliminarElement(cas);
        }
      }
      if (res === 1) {
        if (this.tipusCerca == "assistents") {
          this.assistir(cas);
        } else {
          cas.delete = true;
          this.assistir(cas);
          this.eliminarElement(cas);
        }
      }
    });
  }
  private eliminarElement(cas: IPassarListaModel) {
    let i = this.llistaItems.findIndex((t) => t.delete === true);
    let iT = this.llistaTreball.findIndex((t) => t.delete === true);
    if (i >= 0) {
      setTimeout(() => {
        this.llistaItems.splice(i, 1);
        if (iT >= 0) {
          this.llistaTreball.splice(iT, 1);
        }
        this.seguentPagina();
      }, 500);
    }
  }

  /**
   * Canviar la cerca de Actuals a historics
   * */
  async canviarCerca() {
    this.esdevenimentDetall =
      await this.esdevenimentBS.obtenirEsdevenimentDetallModelStored(this.id) || undefined;
    if (this.esdevenimentDetall == null) {
      try {
        this.esdevenimentDetall =
          await this.esdevenimentBS.obtenirEsdevenimentDetallModel(this.id);
      } catch (er) {
        this.presentarMissatgeError(
          "No es pot carregar el detall, no hi ha internet"
        );
        this.navegarAConfirmacio();
        this.eventService.enviarEventSenseConexio();
        return;
      }
    }
    this.bpotConfirmar = await this.assistenciaBs.potConfirmarAssistencia(
      this.esdevenimentDetall.TipusEsdeveniment
    );
    this.iniciarLlista(await this.obtenirElements(), this.actualitar, async reg => [], 20);

    if (this.esdevenimentDetall != null) {
      this.esdevenimentBS
        .obtenirEsdevenimentDetallModel(this.id)
        .then(async (eve) => {
          if (
            this.esdevenimentDetall!.DataActualitzacio != eve.DataActualitzacio
          ) {
            this.esdevenimentDetall = eve;
            this.bpotConfirmar =
              await this.assistenciaBs.potConfirmarAssistencia(
                this.esdevenimentDetall.TipusEsdeveniment
              );
            this.iniciarLlista(
              await this.obtenirElements(),
              this.actualitar,
              async reg => [],
              20
            );
          }
        });
    }
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
        this.actualitzarLlista(await this.obtenirElements());
      }
    });
    modal.present();
  }
  /** Amar a detall Casteller */
  anarACastellerDet(casteller: ICastellerModel) {
    // go to the session detail page
    // and pass in the session data
    this.navegarAFitxaCasteller(casteller.Id);
  }
}
