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
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { IAlbumsModel } from "src/app/entities/interfaces";
import { CastellersPopUp } from "src/app/compartit/popups/castellers.popup";
import { Storage } from "@ionic/storage";
import { CastellersBs } from "src/app/business/casteller.business";
import { AlbumsBs } from "src/app/business/albums.business";

@Component({
  selector: "album.edit-page",
  templateUrl: "album.edit.page.html",
  styleUrls: ["./album.edit.page.scss"],
})
export class AlbumEditPage extends PaginaNavegacio implements OnInit {
  constructor(
    usuariBs: UsuariBs,
    protected albumbBs: AlbumsBs,
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
  formulari: FormGroup | null = null;
  @ViewChild("imageInput") imageInput: ElementRef | undefined;
  esWeb: boolean = false;

  validadoFotograf(): ValidatorFn {
    /*return this.fndataValidator;*/
    return (control: AbstractControl): { [key: string]: any } | null =>
      control?.get("Fotograf")?.value["Id"] != "0" ? null : { fotograf: true };
  }
  /**
   *
   */
  async ngOnInit() {
    this.esWeb = this.device.esEntornWeb();
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    let noticia: IAlbumsModel | undefined;
    if (this.id && this.id != "0") {
      noticia = await this.albumbBs.obtenirAlbumModel(this.id);
      if (noticia == null) {
        noticia = await this.albumbBs.obtenirNoticiaServidor(this.id);
        if (noticia?.Fotograf) {
          noticia.Fotograf = await this.castellerBs.obtenirCasteller(
            noticia.Fotograf.Id
          );
        }
      }
    }

    if (noticia == null) {
      noticia = {
        Id: "0",
        Activa: true,
        Album: "",
        Descripcio: "",
        Url: "",
        Data: new Date().toISOString(),
      };
    }
    this.titol2 = noticia.Album;
    this.formulari = this.fb.group(
      {
        Id: new FormControl(noticia.Id, [Validators.required]),
        Portada: new FormControl(noticia.Portada, [Validators.required]),
        Album: new FormControl(noticia.Album, [Validators.required]),

        Descripcio: new FormControl(noticia.Descripcio),
        Data: new FormControl(noticia.Data, [Validators.required]),
        Url: new FormControl(noticia.Url, [
          Validators.required,
          Validators.pattern(
            "((?:http://)|(?:https://))(www.)?((?:[a-zA-Z0-9]+.[a-z]{3})|(?:d{1,3}.d{1,3}.d{1,3}.d{1,3}(?::d+)?))([/?=&a-zA-Z0-9.]*)"
          ),
        ]),
        Fotograf: new FormGroup({
          Id: new FormControl(noticia.Fotograf ? noticia.Fotograf.Id : 0),
          Alias: new FormControl(
            noticia.Fotograf ? noticia.Fotograf.Alias : null
          ),
          Foto: new FormControl(
            noticia.Fotograf
              ? noticia.Fotograf.Foto || "assets/img/user/user-anonymous.jpg"
              : null
          ),
          Email: new FormControl(
            noticia.Fotograf ? noticia.Fotograf.Email : null
          ),
        }),
        Activa: new FormControl(noticia.Activa, [Validators.required]),
      },
      {
        validators: this.validadoFotograf(),
      }
    );
  }

  ionViewDidEnter() {
    this.anyMaxim = "" + (new Date().getFullYear() + 2);
  }
  canviarTitol(event: any) {
    if (this.Album) this.Album.setValue(event.target.value);
  }
  get Id() {
    return this.formulari?.get("Id");
  }
  get Portada() {
    return this.formulari?.get("Portada");
  }
  get Album() {
    return this.formulari?.get("Album");
  }
  get Descripcio() {
    return this.formulari?.get("Descripcio");
  }
  get Data() {
    return this.formulari?.get("Data");
  }
  get Url() {
    return this.formulari?.get("Url");
  }
  get Activa() {
    return this.formulari?.get("Activa");
  }
  get Fotograf() {
    return this.formulari?.get("Fotograf");
  }
  get Nombre() {
    return this.formulari?.get("Fotograf")?.value["Alias"];
  }
  get FotoAlias() {
    return this.formulari?.get("Fotograf")?.value["Foto"];
  }
  get Email() {
    return this.formulari?.get("Fotograf")?.value["Email"];
  }
  /**
   *
   */
  async assignarResponsable() {
    let modal = await this.modalCtrl.create({
      component: CastellersPopUp,
      componentProps: {
        rols: this.usuari!.Rols,
      },
    });
    modal.onDidDismiss().then(async (detail: OverlayEventDetail) => {
      let fotograf = this.formulari?.get("Fotograf");
      if (detail && detail.data && fotograf) {
        fotograf.value["Id"] = detail.data.Id;
        fotograf.value["Alias"] = detail.data.Alias;
        fotograf.value["Email"] = detail.data.Email;
        fotograf.value["Foto"] =
          detail.data.Foto || "assets/img/user/user-anonymous.jpg";
      }
      if (this.formulari) this.formulari.updateValueAndValidity();
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
        let portada = this.formulari?.get("Portada");
        portada?.setValue(reader.result);

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
    this.Portada?.setValue("");
  }
  /**
   * Grava una foto
   * @returns
   */
  async grabarFoto() {
    if (this.esWeb) {
      // this.imageInput.nativeElement.click(); // trigger("click");
      let event = new MouseEvent("click", { bubbles: false });
      this.imageInput?.nativeElement.dispatchEvent(event);
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
            this.camera.getPicture(options).then((imageData: any) => {
              console.info("Imatge carregada" + imageData.length);
              this.formulari?.get("Portada")?.setValue("data:image/jpeg;base64," + imageData);
            });

            // this.grabarFotoWithOptions(options);
          },
        },
        {
          icon: "camera",
          text: "Camara",
          handler: () => {
            let options: CameraOptions = {
              quality: 80,
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
            };
            this.camera.getPicture(options).then((imageData: any) => {
              console.info("Imatge carregada" + imageData.length);
              this.formulari?.get("Portada")?.setValue("data:image/jpeg;base64," + imageData);
            });
          },
        },
        {
          icon: "close",
          text: "Cancelar",
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
    this.formulari?.markAllAsTouched();
    if (this.formulari?.valid) {
      const loading = await this.loadingCtrl.create({
        message: "Enviant informació ",
        duration: 10000,
      });
      await loading.present();
      let r = await this.albumbBs.desarAlbum(this.formulari.value);
      loading.dismiss();
      if (!r.Correcte) {
        this.presentarMissatgeError(r.Missatge);
      } else {
        this.presentarMissatge("S'ha creat l'àlbum", 3000);
        this.navegarAEnrera();
      }
    }
    console.warn(this.formulari?.value);
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
      header: "Esborrar àlbum!",
      message: "Vols esborrar l'àlbum?",
      buttons: [
        {
          text: "Cancel·lar",
          role: "cancel",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Eliminar",
          handler: async () => {
            this.formulari?.markAllAsTouched();
            const loading = await this.loadingCtrl.create({
              message: "Enviant informació ",
              duration: 3000,
            });
            await loading.present();
            let r = await this.albumbBs.esborrar(this.formulari?.value);
            loading.dismiss();
            if (!r.Correcte) {
              this.presentarMissatgeError(r.Missatge);
            } else {
              this.presentarMissatge("S'ha esborrat l'àlbum", 3000);
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
