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
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import { PaginaNavegacio } from "../../compartit/components/PaginaNavegacio";
import { StoreData } from "../../services/storage.data";
import {
  ICastellerModel,
  IDeuteModel,
  IUsuariModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { EventService } from "src/app/services/event.service";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";

import { DeviceService } from "src/app/services/device.service";

import { DeutesBs } from "src/app/business/deutes.business";
import { CarregantLogoComponent } from "src/app/compartit/components/carregantlogo.comp";
import { Constants } from "src/app/Constants";

@Component({
  selector: "assistencia-view",
  templateUrl: "assistencia.page.html",
  styleUrls: ["./assistencia.page.scss"],
})
export class AssistenciaPage extends PaginaNavegacio implements OnInit {
  @ViewChild("carregant") carregant: CarregantLogoComponent;
  constructor(
    protected httpClient: HttpClient,
    protected route: Router,
    protected navCtrl: NavController,
    protected usuariBs: UsuariBs,
    protected assistenciaBS: AssistenciaBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected assistenciaBs: AssistenciaBs,
    protected castellersBs: CastellersBs,
    protected deutesBs: DeutesBs,
    protected sincronitzarBs: SincronitzacioDBBs,
    protected deviceService: DeviceService,
    protected activatedRoute: ActivatedRoute,
    protected alertCtrl: AlertController,
    protected store: StoreData,
    protected modalCtrl: ModalController,
    protected actionSheetCtrl: ActionSheetController,
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
  public carregat: boolean = false;
  public idCasteller: string = "0";
  public casteller: ICastellerModel;
  public graficView: boolean = true;

  public llistaItems: any[] = [];
  public assistenciaDiades = [0, 0];
  public assistenciaEntrenos = [0, 0];
  public assistenciaComercials = [0, 0];
  public assistenciaTecnica = [0, 0];
  public assistenciaParticipacio = [0, 0];

  public optionsDiada = {
    title: {
      display: true,
      text: "Assistència en Diades",
      fontSize: 16,
    },
    legend: {
      position: "top",
    },
  };
  public optionsEntrenos = {
    title: {
      display: true,
      text: "Assistència en Entrenaments",
      fontSize: 16,
    },
    legend: {
      position: "top",
    },
  };
  public optionsComercials = {
    title: {
      display: true,
      text: "Assistència en Comercials",
      fontSize: 16,
    },
    legend: {
      position: "top",
    },
  };
  public optionsTecnica = {
    title: {
      display: true,
      text: "Confirmació Tècnica",
      fontSize: 16,
    },
    legend: {
      position: "top",
    },
  };
  public optionsParticipacio = {
    title: {
      display: true,
      text: "Participació",
      fontSize: 16,
    },
    legend: {
      position: "top",
    },
  };
  public graficaEntrenos: any;
  public graficaComercials: any;
  public graficaDiada: any;
  public graficaTecnica: any;
  public graficaParticipacio: any;
  async ngOnInit() {
    this.idCasteller = this.activatedRoute.snapshot.paramMap.get("id");
    this.graficView = true;
    this.carregat = false;
  }
  async onLoad(cas: any) {
    this.casteller = cas;
    this.carregat = true;
    this.graficaDiada = {
      labels: ["Assitència", "No Assistència"],
      datasets: [
        {
          data: this.assistenciaDiades,
          backgroundColor: ["#ffd31a", "#f53d3d"],
          hoverBackgroundColor: ["#dfa31a", "#f6626B"],
        },
      ],
    };
    this.graficaEntrenos = {
      labels: ["Assitència", "No Assistència"],
      datasets: [
        {
          data: this.assistenciaEntrenos,
          backgroundColor: ["#ffd31a", "#f53d3d"],
          hoverBackgroundColor: ["#dfa31a", "#f6626B"],
        },
      ],
    };
    this.graficaComercials = {
      labels: ["Assitència", "No Assistència"],
      datasets: [
        {
          data: this.assistenciaComercials,
          backgroundColor: ["#ffd31a", "#f53d3d"],
          hoverBackgroundColor: ["#dfa31a", "#f6626B"],
        },
      ],
    };
    this.graficaTecnica = {
      labels: ["Confirmat Tècnica", "Pdt. Confirmar"],
      datasets: [
        {
          data: this.assistenciaTecnica,
          backgroundColor: ["#ffd31a", "#f53d3d"],
          hoverBackgroundColor: ["#dfa31a", "#f6626B"],
        },
      ],
    };
    this.graficaParticipacio = {
      labels: ["Informat a Tècnica", "No informat"],
      datasets: [
        {
          data: this.assistenciaParticipacio,
          backgroundColor: ["#ffd31a", "#f53d3d"],
          hoverBackgroundColor: ["#dfa31a", "#f6626B"],
        },
      ],
    };
  }
  async ngAfterViewInit() {
    this.carregant.carregarPromise(this.actualitzarAssistencia(false));
  }
  /**
   * Carregar l'Informació de la pantalla al controller
   */
  async actualitzarAssistencia(forcar: boolean) {
    try {
      if (this.idCasteller != "0") {
        this.casteller = await this.castellersBs.obtenirCasteller(
          this.idCasteller
        );
      } else {
        this.casteller = await this.usuariBs.obtenirCasteller();
      }
      await this.carregarAssistenica();
    } catch (err) {
      this.presentarMissatgeSenseConexio();
      throw err;
    }

    return this.casteller;
  }
  async carregarAssistenica() {
    this.llistaItems = [];

    let lst =
      this.idCasteller != "0"
        ? await this.assistenciaBS.obtenirAssistenciaCasteller(this.idCasteller)
        : await this.assistenciaBS.obtenirAssistenciaUsuari();
    lst.forEach(async (item) => {
      let est = {
        Casteller: await this.castellersBs.obtenirCasteller(item.Casteller),
        Esdeveniment: await this.esdevenimentBs.obtenirEsdeveniment(
          item.Esdeveniment
        ),
        Assistire: item.Assistire,
        ConfirmacioTecnica: item.ConfirmacioTecnica,
        DataModificacio: item.DataModificacio,
      };
      this.llistaItems.push(est);
      if (est.Esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_DIADA) {
        if (est.Assistire) this.assistenciaDiades[0]++;
        else this.assistenciaDiades[1]++;
      } else if (
        est.Esdeveniment.TipusEsdeveniment ==
          Constants.ESDEVENIMENT_ENTRENAMENT ||
        est.Esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_MUSICS
      ) {
        if (est.Assistire) this.assistenciaEntrenos[0]++;
        else this.assistenciaEntrenos[1]++;
      } else if (
        est.Esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_COMERCIAL
      ) {
        if (est.Assistire) this.assistenciaComercials[0]++;
        else this.assistenciaComercials[1]++;
      }

      // Informacio Tècnica
      if (est.Assistire === true || est.Assistire === false)
        if (est.ConfirmacioTecnica || est.Assistire === false)
          this.assistenciaTecnica[0]++;
        else this.assistenciaTecnica[1]++;
      if (est.Assistire === true || est.Assistire === false) {
        this.assistenciaParticipacio[0]++;
      } else this.assistenciaParticipacio[1]++;
    });
  }
  veureAssistencia() {
    this.graficView = false;
  }
}
