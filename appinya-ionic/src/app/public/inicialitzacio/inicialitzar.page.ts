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
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  MenuController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Router } from "@angular/router";
import {
  ICastellerModel,
  IControlDeVersio,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariModel,
} from "src/app/entities/interfaces";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { DeviceService } from "src/app/services/device.service";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { ErrorTemporadaBuida } from "src/app/entities/Errors";

/**
 * Pantalla de visualització d'inicialitzacio d'usuari
 */
@Component({
  selector: "inicialitzar-page",
  templateUrl: "inicialitzar.page.html",
  styleUrls: ["./inicialitzar.page.scss"],
  animations: [
    trigger("visiblitat", [
      state(
        "visible",
        style({
          opacity: 1,
        })
      ),
      state(
        "invisible",
        style({
          opacity: 0,
        })
      ),
      transition("invisible => visible", animate("0.1s 0.3s ease-in")),
      //, transition('visible => invisible', animate('0.3s 0.4s ease-out'))
    ]),
  ],
})
export class InicialitzarPage extends PaginaNavegacio implements OnInit {
  public percentatge: number = 0;
  public percentatgeW: number = 20;

  public casteller: ICastellerModel;
  public foto: string = "assets/img/user/user-anonymous.jpg";

  public storeVisibleState: any = "invisible";
  public condicionsVisibleState: any = "invisible";
  public actualitzacioVisibleState: any = "invisible";
  public validacioInfoVisibleState: any = "invisible";
  public usVisibleState: string = "invisible";
  public fotoVisibleState: any = "invisible";
  public log: string = "";
  public offline: boolean = true;

  constructor(
    protected usuariBs: UsuariBs,
    protected router: Router,
    protected modalCtrl: ModalController,
    protected alertCtrl: AlertController,
    protected navCtrl: NavController,
    protected loadingCtrl: LoadingController,
    protected storeData: StoreData,
    protected menu: MenuController,
    protected toastCtrl: ToastController,
    protected castellerBs: CastellersBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected device: DeviceService
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
   * Metode al entrar al formulari
   * */
  async ngOnInit() {
    this.treballEnProces = true;
    this.menu.enable(false);
    this.storeData.cleanMemoria();
    this.storeVisibleState = "visible";
  }
  /**
   * Metode comencça la carrega d'informació anant pel tutorial
   * */
  async anarInformacioUs() {
    this.storeVisibleState = "invisible";
    this.usVisibleState = "visible";
    this.actualitzacioVisibleState = "invisible";
    this.validacioInfoVisibleState = "invisible";
    this.fotoVisibleState = "invisible";
    document.querySelector("ion-content").scrollToTop(500);
  }
  /**
   * Anar a la pestanya de cargar informació
   */
  async anarCarregarInformacio() {
    this.storeVisibleState = "invisible";
    this.actualitzacioVisibleState = "visible";
    this.validacioInfoVisibleState = "invisible";
    this.usVisibleState = "invisible";
    this.fotoVisibleState = "invisible";
    document.querySelector("ion-content").scrollToTop(1000);
    this.carregarInformacio();
  }
  /**
   * Funcio per setejar logs per pantalla
   * @param missatge Funcio
   * @param percentatge
   */
  private setLog(missatge: string, percentatge: number) {
    this.log = missatge;

    this.percentatge = percentatge < 100 ? percentatge : 100;
    this.percentatgeW = this.percentatge > 20 ? this.percentatge : 20;
    console.info(this.log + " " + this.percentatge + "%");
  }
  /**
   * Rutina de carga de la informació en el dispositiu
   */
  async carregarInformacio() {
    this.setLog("Inciant la càrrega d'informació", 0);
    // Carregar local de informacio de la sessio

    let user = await this.storeData.obtenirUsuari();
    // Se recoger la informacio de l'usuari

    this.setLog("Informació carregada", 1);
    await this.sincronitzacioDBBs
      .ValidarCredencials()
      .then((credencials) => {
        if (!credencials) {
          this.treballEnProces = true;
          this.presentarAlertaCredencialsCaducades();
          this.navegarAInici();
          return;
        }
      })
      .catch((e) => {
        this.treballEnProces = true;
        this.presentarAlertaCredencialsCaducades();
        this.navegarAInici();
        return;
      });

    this.storeData.desarOnline(!this.offline);
    this.setLog("Desar opcions usuari", 1);
    let temporada: ITemporadaModel =
      await this.sincronitzacioDBBs.obtenirTemporadaActual();
    if (!temporada) {
      throw new ErrorTemporadaBuida(
        "Temporada no iniciada. Parla amb l'administrador"
      );
    }
    this.storeData.desarTemporada(temporada);
    this.setLog("Credencials validades pel servidor", 5);
    // Reorganizamos i vinculem el usuari a un casteller
    let userRelacionat: IRespostaServidorAmbRetorn<IUsuariModel> =
      await this.sincronitzacioDBBs.RelacionarCastellerAmbUsuari();

    if (!userRelacionat.Correcte || !userRelacionat.Retorn) {
      // Si esta valdidat refresquem credencials
      this.presentarAlerta(
        "Correu no registrat!",
        "Contacta amb secretaria i facilita aquest correu " +
          userRelacionat.Retorn.Email
      );
      this.navegarAInici();
      return;
    }

    this.setLog("Vinculació usuari>>Casteller OK", 10);
    this.storeData.desarUsuari(userRelacionat.Retorn); // seteixem Usuario Model

    await this.usuariBs.refrescarToken();
    this.setLog("Refresc de credencials", 15);
    if (!userRelacionat.Retorn.CastellerId) {
      //ERROR
      this.presentarAlerta(
        "Correu no registrat!",
        "Contacta amb secretaria i facilita aquest correu " +
          userRelacionat.Retorn.Email
      );
      this.navegarAInici();
    }
    this.storeData.desarUsuari(userRelacionat.Retorn);
    if (this.offline) {
      this.setLog("Adquirint informació bàsica", 20);
      await this.sincronitzacioDBBs.sobreescriureTipusBasics();

      let dateActualitzacio =
        await this.sincronitzacioDBBs.obtenirDataUltimaActualitzacio();
      this.setLog("Adquirint informació castellera", 30);
      await this.sincronitzacioDBBs.sobreescriureCastellers();
      this.setLog("Adquirint informació esdeveniments", 55);
      await this.sincronitzacioDBBs.sobreescriureEsdeveniments();
      this.setLog("Adquirint informació Noticies i fotos", 75);
      await this.sincronitzacioDBBs.sobreescriureNoticiesiAlbums(
        dateActualitzacio
      );
      this.setLog("Adquirint Casteller personal", 85);
      this.storeData.desarDataActualitzacio(dateActualitzacio);
      this.casteller = await this.usuariBS.obtenirCasteller();
      this.casteller = await this.castellerBs.clonarCastellerByModel(
        this.casteller
      );
      this.setLog("Completat", 100);
    } else {
      this.setLog("Adquirint informació bàsica", 60);
      await this.sincronitzacioDBBs.sobreescriureTipusBasics();
      this.setLog("Adquirint Casteller personal", 75);
      this.casteller = await this.usuariBS.obtenirCasteller();
      this.casteller = await this.castellerBs.clonarCastellerByModel(
        this.casteller
      );
      this.setLog("Completat", 100);
    }
    this.anarMostrarInformacioCasteller();
  }

  /**
   * Mostrar la pantalla d'informació castellera
   * */
  async anarMostrarInformacioCasteller() {
    this.storeVisibleState = "invisible";
    this.actualitzacioVisibleState = "invisible";
    this.usVisibleState = "invisible";
    if (this.casteller?.Foto) {
      this.foto = this.casteller.Foto;
      this.fotoVisibleState = "visible";
    } else this.fotoVisibleState = "invisible";
    this.validacioInfoVisibleState = "visible";
  }
  public async mostrarAlertaCanvi() {
    let alert = await this.alertCtrl.create({
      header: "Corregir",
      message: "Canvia el valors",
      inputs: [
        {
          name: "Nom",
          type: "text",
          value: this.casteller.Nom,
          placeholder: "Nom",
        },
        {
          name: "Cognom",
          type: "text",
          value: this.casteller.Cognom,
          placeholder: "Cognom",
        },
        {
          name: "Telefon1",
          type: "number",
          value: this.casteller.Telefon1,
          placeholder: "Telèfon",
        },
        {
          name: "Telefon2",
          type: "number",
          value: this.casteller.Telefon2,
          placeholder: "Telèfon Aux",
        },
        {
          name: "Adreça",
          type: "text",
          value: this.casteller.Direccio,
          placeholder: "Adreça",
        },
        {
          name: "CodiPostal",
          type: "text",
          value: this.casteller.CodiPostal,
          placeholder: "Codi Postal",
        },
      ],
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Desar",
          handler: (data) => {
            this.casteller.Telefon1 = data.Telefon1;
            this.casteller.Telefon2 = data.Telefon2;
            this.casteller.CodiPostal = data.CodiPostal;
            this.casteller.Direccio = data.Direccio;
            this.casteller.Nom = data.Nom;
            this.casteller.Cognom = data.Cognom;
            this.usuariBs
              .enviarEmailConformacioDades(this.casteller)
              .then((t) => {
                this.anarFinalitzar();
              });
          },
        },
      ],
    });
    await alert.present();
  }
  /**
   * Metode per sortir de la pantalla de carrega
   * */
  async anarFinalitzar() {
    this.treballEnProces = false;
    this.storeData.desarVersioDB(this.device.obtenirVersio());
    this.navegarAInici();
  }
  cancelar() {
    this.treballEnProces = false;
    this.navegarAInici();
  }
}
