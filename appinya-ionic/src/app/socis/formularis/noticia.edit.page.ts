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
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { IEntitatHelper, INoticiaModel } from "src/app/entities/interfaces";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
import { NoticiesBs } from "src/app/business/noticies.business";
import { Storage } from "@ionic/storage";
import { CastellersBs } from "src/app/business/casteller.business";
import { Constants } from "src/app/Constants";

@Component({
  selector: "noticia.edit-page",
  templateUrl: "noticia.edit.page.html",
  styleUrls: ["./noticia.edit.page.scss"],
})
export class NoticiaEditPage extends PaginaNavegacio implements OnInit {
  constructor(
    usuariBs: UsuariBs,
    protected noticiesBs: NoticiesBs,
    protected castellerBs: CastellersBs,
    protected sincronitzacioDBBs: SincronitzacioDBBs,
    protected router: Router,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    navCtrl: NavController,
    storeData: StoreData,
    protected storage: Storage,
    protected device: DeviceService,
    toastCtrl: ToastController,
    protected camera: Camera,
    protected fb: FormBuilder,
    protected modalController: ModalController,
    protected activatedRoute: ActivatedRoute,
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
  id: string | null = null;
  anyMaxim: string = "";
  titol2: String = "";
  tipusNoticies: IEntitatHelper[] = [];
  noticiaForm: FormGroup | null = null;
  @ViewChild("imageInput")
  imageInput!: ElementRef;
  esWeb: boolean = false;

  dataValidator(): ValidatorFn {
    /*return this.fndataValidator;*/
    return (control: AbstractControl): { [key: string]: any } | null =>
      control?.get("Data")?.value != "" || control?.get("Indefinida")?.value
        ? null
        : { dataValidator: true };
  }
  /**
   *
   */
  async ngOnInit() {
    this.esWeb = this.device.esEntornWeb();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    let noticia: INoticiaModel | null = null;
    if (this.id != "0" && this.id) {
      noticia = await this.noticiesBs.obtenirNoticiaModel(this.id) || null;
      if (noticia == null) {
        noticia = await this.noticiesBs.obtenirNoticiaServidor(this.id);
        if (noticia.UsuariReferencia) {
          noticia.UsuariReferencia = await this.castellerBs.obtenirCasteller(
            noticia.UsuariReferencia.Id
          );
        }
      }
    }

    if (noticia == null) {
      noticia = {
        Id: "0",
        Activa: true,
        Titol: "",
        Descripcio: "",
        Indefinida: true,
        Url: "",
        IdTipusNoticia: "",
      };
    }
    this.titol2 = noticia.Titol;
    this.noticiaForm = this.fb.group(
      {
        Id: new FormControl(noticia.Id, [Validators.required]),
        Foto: new FormControl(noticia.Foto),
        Titol: new FormControl(noticia.Titol, [Validators.required]),
        IdTipusNoticia: new FormControl(noticia.IdTipusNoticia, [
          Validators.required,
        ]),
        Descripcio: new FormControl(noticia.Descripcio, [Validators.required]),
        Indefinida: new FormControl(noticia.Indefinida),
        Data: new FormControl(noticia.Data),
        Url: new FormControl(
          noticia.Url,
          Validators.pattern(
            "((?:http://)|(?:https://))(www.)?((?:[a-zA-Z0-9]+.[a-z]{3})|(?:d{1,3}.d{1,3}.d{1,3}.d{1,3}(?::d+)?))([/?=&a-zA-Z0-9.]*)"
          )
        ),
        UsuariReferencia: new FormGroup({
          Id: new FormControl(
            noticia.UsuariReferencia ? noticia.UsuariReferencia.Id : 0
          ),
          Alias: new FormControl(
            noticia.UsuariReferencia ? noticia.UsuariReferencia.Alias : null
          ),
          Foto: new FormControl(
            noticia.UsuariReferencia
              ? noticia.UsuariReferencia.Foto ||
              "assets/img/user/user-anonymous.jpg"
              : null
          ),
          Email: new FormControl(
            noticia.UsuariReferencia ? noticia.UsuariReferencia.Email : null
          ),
        }),
        Activa: new FormControl(noticia.Activa, [Validators.required]),
      },
      {
        validators: this.dataValidator(),
      }
    );

    this.tipusNoticies = (await this.storeData.obtenirTipusNoticies()).filter(
      (tipus) => {
        if (
          this.isJunta() ||
          this.isNoticier() ||
          this.isAdmin() ||
          this.isSecretari()
        )
          return true;
        if (tipus.Id == Constants.NOTICIES_BAR && this.isBar()) return true;
        if ((tipus.Id == Constants.NOTICIES_SOCIAL || tipus.Id == Constants.NOTICIES_ENTRENAMENT) && this.isOrganitzador())
          return true;
        return false;
      }
    );
  }

  ionViewDidEnter() {
    this.anyMaxim = "" + (new Date().getFullYear() + 2);
  }
  canviarTitol(event: any) {
    this.Titol?.setValue(event.target.value);
  }
  get Id() {
    return this.noticiaForm?.get("Id");
  }
  get Foto() {
    return this.noticiaForm?.get("Foto");
  }
  get Titol() {
    return this.noticiaForm?.get("Titol");
  }
  get IdTipusNoticia() {
    return this.noticiaForm?.get("IdTipusNoticia");
  }
  get Descripcio() {
    return this.noticiaForm?.get("Descripcio");
  }
  get Indefinida() {
    return this.noticiaForm?.get("Indefinida");
  }
  get Data() {
    return this.noticiaForm?.get("Data");
  }
  get Url() {
    return this.noticiaForm?.get("Url");
  }
  get Activa() {
    return this.noticiaForm?.get("Activa");
  }
  get UsuariReferencia() {
    return this.noticiaForm?.get("UsuariReferencia");
  }
  get Nombre() {
    return this.noticiaForm?.get("UsuariReferencia")?.value["Alias"];
  }
  get FotoAlias() {
    return this.noticiaForm?.get("UsuariReferencia")?.value["Foto"];
  }
  get Email() {
    return this.noticiaForm?.get("UsuariReferencia")?.value["Email"];
  }
  /**
   *
   */
  async assignarResponsable() {
    let modal = await this.modalCtrl.create({
      component: CastellersPopUp,
      componentProps: {
        rols: this.usuari?.Rols,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      if (detail && detail.data && this.noticiaForm) {
        let userRef = this.noticiaForm.get("UsuariReferencia");
        if (userRef) {
          userRef.value["Id"] = detail.data.Id;
          userRef.value["Alias"] =
            detail.data.Alias;
          userRef.value["Email"] =
            detail.data.Email;
          userRef.value["Foto"] =
            detail.data.Foto || "assets/img/user/user-anonymous.jpg";
        }
      }
    });
    modal.present();
  }
  /**
   *  Descarregar Fitxer en format HTML (no device)
   * @param input
   */
  descargarFitxer(input: any) {
    if (input.files && input.files[0]) {
      // this.myDiv.nativeElement.setAttribute("src", input.files[0]);
      var reader = new FileReader();

      reader.onload = () => {
        this.noticiaForm?.get("Foto")?.setValue(reader.result);
        // this.myDiv.nativeElement.setAttribute("src", reader.result);
        //if (img instanceof HTMLImageElement) { (img as HTMLImageElement).src = e.target.result;}
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
  /**
   * Esborrar la foto de portada
   */
  esborrarFoto() {
    this.Foto?.setValue("");
  }
  /**
   * Grava una foto
   * @returns
   */
  async grabarFoto() {
    console.info("Grabar Foto")
    if (this.esWeb) {
      // this.imageInput.nativeElement.click(); // trigger("click");
      let event = new MouseEvent("click", { bubbles: false });
      this.imageInput!.nativeElement.dispatchEvent(event);
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
              this.noticiaForm?.get("Foto")?.setValue("data:image/jpeg;base64," + imageData);
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
              this.noticiaForm?.get("Foto")?.setValue("data:image/jpeg;base64," + imageData);
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
    console.info("Guardar")
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    this.noticiaForm?.markAllAsTouched();
    if (this.noticiaForm?.valid) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant informació ",
        duration: 10000,
      });
      await loading.present();
      let r = await this.noticiesBs.desarNoticia(this.noticiaForm.value);
      loading.dismiss();
      if (!r.Correcte) {
        this.presentarMissatgeError(r.Missatge);
      } else {
        this.presentarMissatge("S'ha creat la notícia", 3000);
        await this.sincronitzacioDBBs.actualitzarPaquets();
        this.navegarAEnrera();
      }
    }
    console.warn(this.noticiaForm?.value);
  }
  /**
   * Esborrar La noticia
   * @returns
   */
  async esborrar() {
    if (!this.device.esConexioActiva()) {
      this.presentarMissatgeSenseConexio();
      return;
    }
    const alert = await this.alertCtlr.create({
      header: "Esborrar Notícia!",
      message: "Vols esborrar la notícia?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Eliminar",
          handler: async () => {
            this.noticiaForm?.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.noticiesBs.esborrarNoticia(
              this.noticiaForm?.value
            );
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha esborrat la notícia", 3000);
              await this.sincronitzacioDBBs.actualitzarPaquets();
              this.navegarAEnrera();
            }
          },
        },
      ],
    });
    alert.present();
  }
  cancelar() {
    this.navegarAEnrera();
  }
}
