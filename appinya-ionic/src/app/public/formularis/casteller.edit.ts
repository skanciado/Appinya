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

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { OverlayEventDetail } from "@ionic/core";
import { UsuariBs } from "src/app/business/Usuari.business";
import { ActivatedRoute, Data, Route, Router } from "@angular/router";
import { SincronitzacioDBBs } from "src/app/business/sincronitzacioDB.business";
import { DeviceService } from "src/app/services/device.service";
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
} from "@angular/forms";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  IAlbumsModel,
  ICastellerModel,
  IEntitatHelper,
  IResponsableLegalModel,
} from "src/app/entities/interfaces";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
import { Storage } from "@ionic/storage";
import { CastellersBs } from "src/app/business/casteller.business";
import { HelperService } from "src/app/services/helper.service";
import { ResponsableLegalPopUp } from "./responsablelegal.popup";
import { environment } from "src/environments/environment";

@Component({
  selector: "casteller.edit",
  templateUrl: "casteller.edit.html",
  styleUrls: ["./casteller.edit.scss"],
})
export class CastellerEditPage extends PaginaNavegacio implements OnInit {
  constructor(
    protected usuariBs: UsuariBs,
    protected castellerBs: CastellersBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected storage: Storage,
    protected device: DeviceService,
    protected toastCtrl: ToastController,
    protected camera: Camera,
    protected fb: FormBuilder,
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
    protected helperService: HelperService,
    protected actionSheetController: ActionSheetController
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
    this.anyMaxim = "" + new Date().getFullYear() + 2;
  }
  id: string;
  anyMaxim: string = "";
  formulari: FormGroup = null;
  @ViewChild("imageInput") imageInput: ElementRef;
  esWeb: boolean = false;
  casteller: ICastellerModel = null;
  municipis: IEntitatHelper[] = [];
  provincies: IEntitatHelper[] = [];
  tipusdocuments: IEntitatHelper[] = [];
  nomcomplet: String = "";
  urlFoto: string = environment.UrlServidor + "/api/v1.0/castellers/fotos";
  /**
   *
   */
  async ngOnInit() {
    this.esWeb = this.device.esEntornWeb();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    let casteller: ICastellerModel = null;
    let user = await this.storeData.obtenirUsuariSession();
    this.helperService.obtenirLlistaProvincies(user).subscribe((p) => {
      this.provincies = p;
    });

    this.tipusdocuments = await this.storeData.obtenirTipusDocument();
    if (this.id != "0") {
      casteller = await this.castellerBs.obtenirCasteller(this.id);
    }
    if (casteller == null) {
      casteller = {
        Id: "0",
        Alias: "",
        Nom: "",
        Cognom: "",
        Email: "",
        Telefon1: "",
        Telefon2: "",
        Assegurat: false,
        ResponsablesLegals: [],
        Carrec: "",
        CodiPostal: "",
        IdTipusDocument: "",
        TipusDocument: "",
        DataAlta: new Date().toISOString(),
        DataBaixa: null,
        DataEntregaCamisa: null,
        DataNaixement: null,
        Document: "",
        Direccio: "",
        Sanitari: false,
        EsCascLloguer: false,
        TeCasc: false,
        Edat: null,
        RebreCorreuFotos: false,
        RebreCorreuNoticies: false,
        EsBaixa: false,
        Foto: null,
        IdUsuari: null,
        Municipi: null,
        Provincia: null,
        IdProvincia: null,
        IdMunicipi: null,
        TeCamisa: false,
        VisDataNaixement: false,
        VisDireccio: false,
        VisTelefon1: false,
        VisTelefon2: false,
        Habitual: false,
        Actiu: true,
      };
    }
    this.nomcomplet = casteller.Nom + " " + casteller.Cognom;
    if (casteller.IdProvincia) {
      this.helperService
        .obtenirLlistaMunicipis(casteller.IdProvincia, user)
        .subscribe((p) => {
          this.municipis = p;
        });
    }
    this.formulari = this.fb.group(
      {
        Id: new FormControl(casteller.Id, [Validators.required]),
        Nom: new FormControl(casteller.Nom, [Validators.required]),
        Cognom: new FormControl(casteller.Cognom, [Validators.required]),
        Alias: new FormControl(casteller.Alias),
        Email: new FormControl(casteller.Email, [Validators.email]),
        Telefon1: new FormControl(casteller.Telefon1, [Validators.required]),
        IdTipusDocument: new FormControl("" + casteller.IdTipusDocument, [
          Validators.required,
        ]),
        Document: new FormControl(casteller.Document, [Validators.required]),
        Telefon2: new FormControl(casteller.Telefon2),
        Carrec: new FormControl(casteller.Carrec),
        Direccio: new FormControl(casteller.Direccio, [Validators.required]),
        CodiPostal: new FormControl(casteller.CodiPostal, [
          Validators.required,
        ]),
        IdMunicipi: new FormControl("" + casteller.IdMunicipi, [
          Validators.required,
        ]),
        IdProvincia: new FormControl("" + casteller.IdProvincia, [
          Validators.required,
        ]),
        Assegurat: new FormControl(casteller.Assegurat),
        Edat: new FormControl(casteller.Edat || 0),
        DataNaixement: new FormControl(casteller.DataNaixement, [
          Validators.required,
        ]),
        TeCamisa: new FormControl(casteller.TeCamisa),

        DataEntregaCamisa: new FormControl(casteller.DataEntregaCamisa),
        DataAlta: new FormControl(casteller.DataAlta, [Validators.required]),
        DataBaixa: new FormControl(casteller.DataBaixa),
        EsBaixa: new FormControl(casteller.EsBaixa),
        Foto: new FormControl(casteller.Foto),
        Habitual: new FormControl(casteller.Habitual),
        Actiu: new FormControl(casteller.Actiu),
        Sanitari: new FormControl(casteller.Sanitari),
        TeCasc: new FormControl(casteller.TeCasc),
        EsCascLloguer: new FormControl(casteller.EsCascLloguer),
        ResponsablesLegals: new FormControl(casteller.ResponsablesLegals),
      },
      {
        validators: this.menorValidator(),
      }
    );
  }
  menorValidator(): ValidatorFn {
    /*return this.fndataValidator;*/

    return (control: AbstractControl): { [key: string]: any } | null => {
      let d1 = new Date(control.get("DataNaixement").value);

      let month_diff = Date.now() - d1.getTime();
      let age_dt = new Date(month_diff);
      let age = Math.abs(age_dt.getUTCFullYear() - 1970);
      console.log(age);
      if (age > 18) {
        let document: boolean = false;
        let email: boolean = false;
        if (control.get("Email").value == "") {
          email = true;
        }
        if (control.get("Document").value == "") {
          document = true;
        }
        if (control.get("IdTipusDocument").value == "") {
          document = true;
        }
        if (document || email)
          return { tipusDNI: document, emailRequired: email };
        else return null;
      } else return null;
    };
  }

  ionViewDidEnter() {
    this.anyMaxim = "" + new Date().getFullYear();
  }
  async canviarProvincia() {
    this.IdMunicipi.setValue("");
    let user = await this.storeData.obtenirUsuariSession();
    this.helperService
      .obtenirLlistaMunicipis(this.IdProvincia.value, user)
      .subscribe((p) => {
        this.municipis = p;
      });
  }
  get Id() {
    return this.formulari.get("Id");
  }
  get Nom() {
    return this.formulari.get("Nom");
  }
  get Cognom() {
    return this.formulari.get("Cognom");
  }
  get Alias() {
    return this.formulari.get("Alias");
  }
  get Email() {
    return this.formulari.get("Email");
  }
  get Telefon1() {
    return this.formulari.get("Telefon1");
  }
  get IdTipusDocument() {
    return this.formulari.get("IdTipusDocument");
  }
  get Document() {
    return this.formulari.get("Document");
  }
  get Telefon2() {
    return this.formulari.get("Telefon2");
  }
  get Carrec() {
    return this.formulari.get("Carrec");
  }
  get Direccio() {
    return this.formulari.get("Direccio");
  }
  get CodiPostal() {
    return this.formulari.get("CodiPostal");
  }
  get IdMunicipi() {
    return this.formulari.get("IdMunicipi");
  }
  get IdProvincia() {
    return this.formulari.get("IdProvincia");
  }
  get Assegurat() {
    return this.formulari.get("Assegurat");
  }
  get DataNaixement() {
    return this.formulari.get("DataNaixement");
  }
  get TeCamisa() {
    return this.formulari.get("TeCamisa");
  }
  get DataEntregaCamisa() {
    return this.formulari.get("DataEntregaCamisa");
  }
  get EsBaixa() {
    return this.formulari.get("EsBaixa");
  }
  get DataBaixa() {
    return this.formulari.get("DataBaixa");
  }
  get Foto() {
    return this.formulari.get("Foto");
  }
  get Habitual() {
    return this.formulari.get("Habitual");
  }
  get Actiu() {
    return this.formulari.get("Actiu");
  }
  get Sanitari() {
    return this.formulari.get("Sanitari");
  }
  get TeCasc() {
    return this.formulari.get("TeCasc");
  }
  get EsCascLloguer() {
    return this.formulari.get("EsCascLloguer");
  }
  get RebreCorreuFotos() {
    return this.formulari.get("RebreCorreuFotos");
  }
  get RebreCorreuNoticies() {
    return this.formulari.get("RebreCorreuNoticies");
  }
  get ResponsablesLegals() {
    return this.formulari.get("ResponsablesLegals");
  }
  async esborrarResponse(cas) {
    let responsables: any[] = this.formulari.get("ResponsablesLegals").value;
    let find = responsables.findIndex((t) => {
      if (t.Id == cas.Id) return true;
      else return false;
    });
    if (find >= 0) {
      responsables.splice(find, 1);
    }
  }
  /**
   *
   */
  async editarResponsable(res?: IResponsableLegalModel) {
    let modal = await this.modalCtrl.create({
      component: ResponsableLegalPopUp,
      componentProps: {
        responsables: this.formulari.get("ResponsablesLegals").value,
        responsable: res,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        let responsables: any[] =
          this.formulari.get("ResponsablesLegals").value;
        let find = false;

        for (let responsable of responsables) {
          if (
            responsable["TipusResponsableId"] == detail.data.TipusResponsableId
          ) {
            find = true;
            break;
          }
        }
        if (!find) {
          responsables.push(detail.data);
        }
      }

      this.formulari.updateValueAndValidity();
    });
    modal.present();
  }

  /**
   *  Descarregar Fitxer en format HTML (no device)
   * @param input
   */
  descargarFitxer(input) {
    if (input.files && input.files[0]) {
      // this.myDiv.nativeElement.setAttribute("src", input.files[0]);
      var reader = new FileReader();

      reader.onload = () => {
        this.formulari.get("Foto").setValue(reader.result);

        // this.myDiv.nativeElement.setAttribute("src", reader.result);
        //if (img instanceof HTMLImageElement) { (img as HTMLImageElement).src = e.target.result;}
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
  /**
   * Esborrar la foto
   */
  esborrarFoto() {
    this.Foto.setValue("");
  }
  /**
   * Grava una foto
   * @returns
   */
  async grabarFoto() {
    if (this.esWeb) {
      // this.imageInput.nativeElement.click(); // trigger("click");
      let event = new MouseEvent("click", { bubbles: false });
      this.imageInput.nativeElement.dispatchEvent(event);
      return;
    }
    let actionSheet = await this.actionSheetController.create({
      header: "Agafar una foto de...",
      buttons: [
        {
          icon: "photos",
          text: "Galeria",
          handler: () => {
            let options: CameraOptions = {
              quality: 80,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
            };
            this.camera.getPicture(options).then((imageData) => {
              console.info("Imatge carregada" + imageData.length);
              this.formulari
                .get("Foto")
                .setValue("data:image/jpeg;base64," + imageData);
            });

            // this.grabarFotoWithOptions(options);
          },
        },
        {
          icon: "camera",
          text: "Càmara",
          handler: () => {
            let options: CameraOptions = {
              quality: 80,
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
            };
            this.camera.getPicture(options).then((imageData) => {
              console.info("Imatge carregada" + imageData.length);
              this.formulari
                .get("Foto")
                .setValue("data:image/jpeg;base64," + imageData);
            });
          },
        },
        {
          icon: "close",
          text: "Cancel·lar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    actionSheet.present();
  }
  /**
   * Confirmar Formulari
   * @returns
   */
  async onSubmit() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    this.formulari.markAllAsTouched();
    if (this.formulari.valid) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant informació ",
        duration: 10000,
      });
      await loading.present();
      let r = await this.castellerBs.desaCasteller(this.formulari.value);
      loading.dismiss();
      if (!r.Correcte) {
        this.presentarMissatgeError(r.Missatge);
      } else {
        await this.sincronitzacioDBBs.actualitzarPaquets();
        this.presentarMissatge("S'ha modificat correctament", 3000);
        this.navegarAEnrera();
      }
    }
    console.warn(this.formulari.value);
  }

  cancelar() {
    this.navegarAEnrera();
  }
}
