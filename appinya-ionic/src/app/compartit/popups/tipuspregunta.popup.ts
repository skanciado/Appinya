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

import {
  NavParams,
  ModalController,
  ToastController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { UsuariBs } from "src/app/business/Usuari.business";
import { IPreguntaModel } from "src/app/entities/interfaces";

import { StoreData } from "../../services/storage.data";
import { PopUpGeneric } from "../components/PopUpGeneric";

@Component({
  selector: "tipuspregunta-popup",
  templateUrl: "tipuspregunta.popup.html",
  styleUrls: ["./tipuspregunta.popup.scss"],
})
export class TipusPreguntaPopUp extends PopUpGeneric implements OnInit {
  pregunta: IPreguntaModel | undefined;
  nova: boolean = true;
  @Input() preguntes: Array<any> | undefined;
  constructor(
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
    this.preguntes = this.navParams.get("preguntes") || new Array();
    this.pregunta = this.navParams.get("pregunta");
    if (!this.pregunta) {
      this.nova = true;
      this.pregunta = {
        Pregunta: "",
        ComboRespuesta: [],
        TipusPregunta: "10",
        Valores: [],
        Resposta: "",
        IdPregunta: "0",
      };
    } else {
      this.nova = false;
    }
  }
  agregarOpcio() {
    this.pregunta?.Valores.push("Nova Opció");
  }
  eliminarOpcio(op: any) {
    let i = this.pregunta?.Valores.indexOf(op);
    if (i) this.pregunta?.Valores.splice(i, 1);
  }
  canviarTipus(id: any) {
    if (this.pregunta) this.pregunta.TipusPregunta = id;
  }
  override cancelar() {
    this.modalController.dismiss(null);
  }
  trackEditList(index: any, item: any) {
    return index;
  }
  desar() {
    if (!this.pregunta?.Pregunta) {
      this.presentarMissatgeError("El camp Pregunta és obligatori");
    } else if (
      this.pregunta.TipusPregunta == "20" &&
      this.pregunta.Valores.length == 0
    ) {
      this.presentarMissatgeError(
        "Has d'afegir opcions en aquest tipus de pregunta"
      );
    } else {
      if (this.nova) this.modalController.dismiss(this.pregunta);
      else this.modalController.dismiss(null);
    }
  }
}
