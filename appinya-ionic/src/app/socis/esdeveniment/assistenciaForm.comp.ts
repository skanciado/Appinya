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
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  IonFab,
} from "@ionic/angular";
import { PaginaNavegacio } from "../../compartit/components/PaginaNavegacio";
import { StoreData } from "../../services/storage.data";
import {
  IAssistenciaModel,
  ICastellerModel,
  IEsdevenimentDetallFormModel,
} from "../../entities/interfaces";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Router } from "@angular/router";
import { EsdevenimentBs } from "src/app/business/esdeveniments.business";
import { CastellersBs } from "src/app/business/casteller.business";
import { AssistenciaBs } from "src/app/business/assistencia.business";
import { HttpClient } from "@angular/common/http";
import { EventService } from "src/app/services/event.service";
import { DeviceService } from "src/app/services/device.service";
@Component({
  selector: "assistenciaform-comp",
  templateUrl: "assistenciaForm.comp.html",
  styleUrls: ["./assistenciaForm.comp.scss"],
})
export class AssistenciaFormComponent
  extends PaginaNavegacio
  implements OnInit {
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
    protected eventService: EventService,
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
  @Output() onChange = new EventEmitter<any>();
  esdevenimentDetall: IEsdevenimentDetallFormModel | undefined;
  assistenciaDetall: IAssistenciaModel | undefined;
  casteller: ICastellerModel | undefined;
  @Input()
  set esdeveniment(esdeveniemnt: IEsdevenimentDetallFormModel) {
    this.esdevenimentDetall = esdeveniemnt;
  }

  @Input()
  set assistencia(assistencia: IAssistenciaModel) {
    this.assistenciaDetall = assistencia;
    this.castellersBs.obtenirCasteller(assistencia.Casteller).then((cas) => {
      this.casteller = cas;
    });
  }
  /**
   * Funcion inici
   * */
  async ngOnInit() { }

  canviarFormulari() {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    if (this.assistenciaDetall?.Assistire != true) {
      this.presentarMissatgeError(
        "Avis: s'ha de confirmar l'assistència de " + this.casteller!.Nom
      );
      return;
    }
    this.assistenciaBs
      .confirmarAssistenciaDelegat(this.assistenciaDetall)
      .then((res) => {
        if (!res.Correcte) {
          this.presentarMissatgeError(res.Missatge);
        } else {
          this.onChange.emit();
        }
      })
      .catch((err) => {
        this.presentarAlerta(
          "Error en la confirmació",
          "No s'ha pogut confirmar (" + err + ")"
        );
      });
  }

  ngOnDestroy() { }
  /**
   * Confirmacio assistencia
   * @param assitire
   */
  async confirmar(assitire: boolean) {
    if (!this.deviceService.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    let carregant = await this.presentarCarregant(
      "Enviant informació al servidor"
    );
    carregant.present();
    this.assistenciaDetall!.Assistire = assitire;
    this.assistenciaBs
      .confirmarAssistenciaDelegat(this.assistenciaDetall!)
      .then((res) => {
        if (!res.Correcte) {
          this.presentarMissatgeError(res.Missatge);
        } else {
          this.onChange.emit();
        }
        carregant.dismiss();
      })
      .catch((err) => {
        this.presentarAlerta(
          "Error en la confirmació",
          "No s'ha pogut confirmar (" + err + ")"
        );
        carregant.dismiss();
      });
  }
}
