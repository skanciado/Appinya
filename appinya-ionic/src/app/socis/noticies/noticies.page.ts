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
import { OverlayEventDetail } from "@ionic/core";
import { Component, ViewChild, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { UsuariBs } from "src/app/business/Usuari.business";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Router } from "@angular/router";
import { IAlbumsModel, INoticiaModel } from "src/app/entities/interfaces";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { NoticiesBs } from "src/app/business/noticies.business";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { Constants } from "src/app/Constants";

@Component({
  selector: "noticies-page",
  templateUrl: "noticies.page.html",
  styleUrls: ["./noticies.page.scss"],
  animations: [
    trigger("expand", [
      state("active", style({ height: "*" })),
      state("inactive", style({ height: "150px" })),
      transition("active <=> inactive", animate("900ms ease-in-out")),
      /*
 transition('inactive => active', animate(1000, keyframes([
        style({transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)', offset: .15}),
        style({transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)', offset: .30}),
        style({transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)', offset: .45}),
        style({transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)', offset: .60}),
        style({transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)', offset: .75}),
        style({transform: 'none', offset: 1}),
      ]))),
*/
    ]),
  ],
})
export class NoticiesPage extends PaginaLlista implements OnInit {
  noticies: Array<{
    noticia: INoticiaModel;
    expand: string;
    canExpand: boolean;
  }> = [];
  tipusCerca: string = "actual";
  carregant: boolean = false;
  constructor(
    usuariBs: UsuariBs,
    protected noticiesBs: NoticiesBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    navCtrl: NavController,
    storeData: StoreData,
    toastCtrl: ToastController
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
  }
  /**
   * Metode executa al entrar
   */
  async ngOnInit() {
    this.tipusCerca == "actual";
    console.info("Entrar en Noticies");

  }
  ionViewDidEnter() {
    this.sincronitzacioDBBs
      .actualitzarPaquets()
      .then((t) => {
        this.canviarCerca();
      })
      .catch((e) => {
        console.error("Error" + e);
        this.canviarCerca();
      });
  }
  async canviarCerca() {
    if (this.tipusCerca == "actual") {
      console.info("actual");

      this.iniciarLlista(
        await this.noticiesBs.obtenirNoticiesActuals(0),
        this.actualitarPaquets,
        this.paginacioActualFuncio,
        Constants.PAGINACIO
      );
    } else {
      console.info("Historic");
      this.iniciarLlista(
        await this.noticiesBs.obtenirHistoricNoticies(0),
        this.actualitarPaquets,
        this.paginacioHistoricFuncio,
        Constants.PAGINACIO
      );
    }
  }
  /**
   * Metode actualitzacio
   * */
  async paginacioActualFuncio(reg: number): Promise<INoticiaModel[]> {
    return await this.noticiesBs.obtenirNoticiesActuals(reg);
  }
  /**
   * Metode actualitzacio
   * */
  async paginacioHistoricFuncio(reg: number): Promise<INoticiaModel[]> {
    let result = await this.noticiesBs.obtenirHistoricNoticies(reg);
    return result;
  }
  /** 
   * Metode actualitzacio
   * */
  async actualitarPaquets() {
    const r1 = await this.sincronitzacioDBBs.actualitzarPaquets();
    if (this.tipusCerca == "actual") {
      let lst = await this.noticiesBs.obtenirNoticiesActuals(0);
      this.actualitzarLlistaAdvanced(lst);
    } else {
      let lst = await this.noticiesBs.obtenirHistoricNoticies(0);
      this.actualitzarLlistaAdvanced(lst);
    }
    this.carregant = false;
  }
  /**
   * Per actualitzar la vista amb les noves dades
   * @param llista
   */
  public actualitzarLlistaAdvanced(llista: INoticiaModel[]) {
    this.llistaTreball = llista;
    for (var i = 0; i < this.llistaItems.length; i++) {
      if (llista.length > i) {
        this.llistaItems[i] = llista[i];
      } else {
        this.llistaItems.splice(i, 1);
      }
    }
    if (
      this.llistaItems.length < 10 &&
      this.llistaTreball.length > this.llistaItems.length
    ) {
      for (var i = this.llistaItems.length; i < llista.length; i++) {
        this.llistaItems.push(llista[i]);
      }
    }
  }

  expandirNoticia(not: any, expand: string) {
    not.expand = expand == "active" ? "inactive" : "active";
  }

  /**
   * Per anar a una URL d'una noticia
   * @param not Notícia seleccionada
   */
  anarAUrl(not: INoticiaModel) {
    let a = new InAppBrowser();
    a.create(not.Url, "_blank", "location=yes");
  }

  /**
   * Funcio per detectar depenent del usuari conectat si te permsios d'edició
   * @param not Notícia seleccionada
   */
  potEditarNoticia(not: INoticiaModel): boolean {
    if (this.isNoticier()) return true;
    if (this.isJunta()) return true;
    if (this.isAdmin()) return true;
    if (this.isSecretari()) return true;
    if (this.isBar() && not.IdTipusNoticia == "6") return true;
    if (
      this.isOrganitzador() &&
      (not.IdTipusNoticia == "4" || not.IdTipusNoticia == "5")
    )
      return true;
    return false;
  }
  public async editarNoticia(not: any) {
    this.navegarAEditarNoticia(not ? not.Id : 0);
  }
}
