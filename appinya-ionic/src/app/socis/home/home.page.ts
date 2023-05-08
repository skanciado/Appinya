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
import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  NavController,
  ToastController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { UsuariBs } from "../../business/Usuari.business";
import { Router } from "@angular/router";
import { StoreData } from "../../services/storage.data";
import { DeviceService } from "../../services/device.service";
import {
  IEsdevenimentResumModel,
  INoticiaModel,
} from "../../entities/interfaces";
import { HomeBs } from "src/app/business/home.business";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { Constants } from "src/app/Constants";
import { NoticiaComponent } from "src/app/compartit/components/noticia.comp";
import { NoticiaPopUp } from "src/app/compartit/popups/noticia.popup";
@Component({
  selector: "home-page",
  templateUrl: "home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage extends PaginaNavegacio implements OnInit {
  text: string = "";
  estatLlistat: number = Constants.ESTAT_LLISTAT_CARREGANT;
  slideOpts = {
    initialSlide: 1,
    speed: 600,
    centerInsufficientSlides: true,
    spaceBetween: 30,
    slidesPerView: "auto",
    autoplay: {
      delay: 8000,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
  };
  slideOpts2 = {
    initialSlide: 1,
    reverseDirection: true,
    speed: 600,
    centerInsufficientSlides: true,
    spaceBetween: 30,
    slidesPerView: "auto",
    autoplay: {
      delay: 7000,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
  };

  esdevenimentsActuals: IEsdevenimentResumModel[] = [];
  noticiesActuals: INoticiaModel[] = [];

  constructor(
    protected homeBs: HomeBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    usuariBs: UsuariBs,
    route: Router,
    protected modalCtrl: ModalController,
    navCtrl: NavController,
    toastCtrl: ToastController,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    storeData: StoreData,
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
  async ngOnInit() { }
  async ionViewDidEnter() {
    this.estatLlistat = Constants.ESTAT_LLISTAT_CARREGANT;
    this.actualitzarNoticies();
    this.sincronitzacioDBBs.actualitzarPaquets().then(async (t) => {
      if (t && (t.ActNoticies > 0 || t.ActEsdeveniments > 0)) {
        await this.sincronitzacioDBBs.actualitzarInformacioPublica();
      }
      this.actualitzarNoticies();
    });
  }
  async actualitzarNoticies() {
    await this.homeBs
      .ObtenirHome()
      .then((resum) => {
        if (resum) {
          this.noticiesActuals = resum.Noticies || [];
          this.esdevenimentsActuals = resum.Esdeveniments || [];
        }
        this.estatLlistat = Constants.ESTAT_LLISTAT_CARREGAT;
      })
      .catch((e) => {
        this.estatLlistat = Constants.ESTAT_LLISTAT_ERROR_CONEXIO;
        throw e;
      });
  }
  async clickNoticia(not: any) {
    let modal = await this.modalCtrl.create({
      component: NoticiaPopUp,
      componentProps: {
        noticia: not,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
      }
    });
    modal.present();
  }
}
