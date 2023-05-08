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
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { lastValueFrom } from 'rxjs';
import {
  NavParams,
  ModalController,
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ITemporadaModel } from "src/app/entities/interfaces";
import { TemporadaService } from "src/app/services/temporada.service";

import { StoreData } from "../../services/storage.data";
import { PopUpGeneric } from "../components/PopUpGeneric";

@Component({
  selector: "temporada-popup",
  templateUrl: "temporada.popup.html",
  styleUrls: ["./temporada.popup.scss"],
})
export class TemporadaPopUp extends PopUpGeneric implements OnInit {
  temporades: Array<{
    Id: number;
    titol: string;
    temporada: ITemporadaModel;
  }> = [];

  constructor(
    protected temporadaService: TemporadaService,
    usuariBS: UsuariBs,
    toastCtrl: ToastController,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    route: Router,
    protected navParams: NavParams,
    storeData: StoreData,
    modalController: ModalController
  ) {
    super(
      usuariBS,
      route,
      modalController,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
  }
  /**
   * Inicialitzador PopUp
   */
  ngOnInit() {
    // passed in array of track names that should be excluded (unchecked)
    let totes: boolean = this.navParams.get("totes") || true;
    let date = new Date();
    this.storeData.obtenirUsuariSession().then(async (user) => {
      let temporadas = await lastValueFrom(this.temporadaService
        .obtenirTemporades(user));
      temporadas.forEach((t1) => {
        if (totes == true || t1.DataFi < date.toISOString())
          this.temporades.push({
            Id: t1.Id,
            titol: t1.Descripcio,
            temporada: t1,
          });
      });
    });
  }
  seleccionar(temp: any) {
    this.modalController.dismiss(temp.temporada);
  }
}
