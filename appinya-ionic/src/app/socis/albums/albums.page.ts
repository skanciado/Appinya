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

import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations";
import { OverlayEventDetail } from "@ionic/core";
import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import {
  AlertController,
  ModalController,
  LoadingController,
  ToastController,
  IonFab,
  ActionSheetController,
  NavController,
} from "@ionic/angular";

import { StoreData } from "../../services/storage.data";
import {
  ITemporadaModel,
  ILikesHelper,
  IAlbumsModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { Router } from "@angular/router";
import { PaginaLlista } from "src/app/compartit/components/PaginaLlista";
import { TemporadaPopUp } from "src/app/compartit/popups/temporada.popup";
import { AlbumsBs } from "src/app/business/albums.business";
import { DeviceService } from "src/app/services/device.service";
import { RolsPopUp } from "src/app/compartit/popups/rols.popup";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
@Component({
  selector: "albums",
  templateUrl: "albums.page.html",
  styleUrls: ["./albums.page.scss"],
  animations: [
    trigger("like", [
      transition(
        "active => inactive",
        animate(
          1000,
          keyframes([
            style({
              transform: "translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)",
              offset: 0.15,
            }),
            style({
              transform: "translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)",
              offset: 0.3,
            }),
            style({
              transform: "translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)",
              offset: 0.45,
            }),
            style({
              transform: "translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)",
              offset: 0.6,
            }),
            style({
              transform: "translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)",
              offset: 0.75,
            }),
            style({ transform: "none", offset: 1 }),
          ])
        )
      ),
      transition(
        "inactive => active",
        animate(
          2000,
          keyframes([
            style({ transform: "scale(1.5,1.5)", offset: 0.15 }),
            style({ transform: "none", offset: 0.3 }),
            style({ transform: "scale(1.5,1.5) ", offset: 0.45 }),
            style({ transform: "none ", offset: 0.6 }),
            style({ transform: "scale(1.5,1.5)", offset: 0.75 }),
            style({ transform: "none", offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class AlbumsPage extends PaginaLlista implements OnInit {
  actionSheet: any;
  tipusCerca: string = "actual";
  temporada: ITemporadaModel | undefined;
  constructor(
    usuariBs: UsuariBs,
    protected sincronitzacioBs: SincronitzacioDBBs,
    protected albumsBs: AlbumsBs,
    protected router: Router,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    navCtrl: NavController,
    storeData: StoreData,
    toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
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
  }
  /**
   * Metode Inicialitzat
   * */
  async ngOnInit() {
    this.tipusCerca = "actual";
    this.canviarCerca();
  }

  async canviarTemporadaClick() {
    await this.canviarTemporada();
    this.canviarCerca();
  }
  /**
   * Event Canviar temporada
   * */
  async canviarTemporada(): Promise<ITemporadaModel | undefined> {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    let modal = await this.modalCtrl.create({
      component: TemporadaPopUp,
      componentProps: {},
    });
    modal.present();
    let detail: OverlayEventDetail = await modal.onDidDismiss();
    if (detail && detail.data) {
      this.temporada = detail.data;
      return detail.data;
    } else {
      return;
    }
  }
  /**
   * Metode Actualitzacio de Albums Historics
   * */
  async actualitzarHistoric() {
    if (this.temporada)
      this.llistaTreball = await this.albumsBs.obtenirAlbumsHistorics(
        this.temporada.Id
      );
  }
  /** Metode d'actualitzacio */
  async actualitzarActual() {
    await this.sincronitzacioBs.actualitzarPaquets();

    let t = await this.storeData.obtenirTemporada();
    let likes: ILikesHelper[] = await this.albumsBs.obtenirLikes(t.Id);
    await this.albumsBs.guardarLikes(likes);
    for (let t of this.llistaTreball) {
      const like = likes.find((like) => {
        return like.IdAlbum == t.Id;
      });
      t.Likes = like?.Likes;
      t.JoLike = like?.JoLike;
    }
  }

  /**
   * Canvi de cerca
   * @param val
   */
  async canviarCerca() {
    this.llistaItems = [];
    if (this.tipusCerca == "actual") {
      // Si es actual
      let fotos: IAlbumsModel[] = await this.albumsBs.obtenirAlbums();
      this.iniciarLlista(fotos, this.actualitzarActual, async (reg) => [], 5);
    } else {
      // Si es historic
      if (this.temporada) {
        // Si te temporara pregunta al servidor
        this.iniciarLlista([], this.actualitzarHistoric, async (reg) => [], 5);
      } else {
        // Si no te temporada, forcem una selecció de temporada
        let temporada = await this.canviarTemporada();

        if (temporada) {
          this.canviarCerca();
        } else {
          this.temporada = undefined;
          this.tipusCerca = "actual";
          this.presentarMissatgeError("No has seleccionat cap temporada");
        }
      }
    }
  }

  /**
   * Per anar a una URL d'una foto
   * @param foto Foto seleccionada
   */
  anarAUrl(foto: IAlbumsModel) {
    window.open(foto.Url, "_blank");
  }
  /**
   * Funció per ediar una noticia
   * @param foto Foto seleccionada
   */
  editarFoto(foto: IAlbumsModel | null) {
    this.navegarAEditarAlbum(foto ? foto.Id : 0);
  }
  /**
   * Funcio per anar a la persona responsable de la noticia (sobre un desplegable inferior)
   * @param not Notícia seleccionada
   */
  async anarAEmail(foto: IAlbumsModel) {
    let actionSheet = await this.actionSheetCtrl.create({
      header:
        "Correu electrònic de  " +
        foto!.Fotograf!.Nom +
        " " +
        foto!.Fotograf!.Cognom,
      buttons: [
        {
          text: `Email- ( ${foto!.Fotograf!.Email} )`,
          icon: "mail",
          handler: () => {
            window.open("mailto:" + foto!.Fotograf!.Email);
          },
        },
        {
          text: "Cancel·lar",
          role: "cancel",
        },
      ],
    });
    actionSheet.present();
  }
  /**
   * Funció per fer el Like a un album
   * @param foto Foto objecte del like
   * @param like Si ha fet Like o Dislike
   */
  async ferLike(foto: IAlbumsModel, like: boolean) {
    if (!this.isCasteller()) {
      this.presentarMissatgeError(
        "No has entrat com a casteller, accedeix amb el teu compte "
      );
      //  this.nav.push(AccesViewPage);
      return;
    }
    foto.estat = like ? "active" : "inactive";
    foto.JoLike = like;
    if (like) {
      this.albumsBs.like(foto).then(
        (t) => {
          foto.Likes = t.Retorn;
          foto.JoLike = like;
        },
        (e) => {
          this.presentarMissatgeError("No s'ha pogut enviar donar like");
          console.error("No s'ha pogut enviar el Like");
        }
      );
    } else {
      this.albumsBs.eliminarLike(foto).then(
        (t) => {
          foto.Likes = t.Retorn;
          foto.JoLike = like;
        },
        (e) => {
          this.presentarMissatgeError("No s'ha pogut donar like");
          console.error("No s'ha pogut enviar el Like");
        }
      );
    }
  }

  /**
   * Funcio per detectar depenent del usuari conectat si te permsios d'edició
   * @param foto Notícia seleccionada   */
  potEditarFoto(foto: IAlbumsModel): boolean {
    if (this.isNoticier()) return true;
    if (this.isJunta()) return true;
    if (this.isAdmin()) return true;
    if (this.isSecretari()) return true;
    return false;
  }
}
