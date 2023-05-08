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
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import {
  ToastController,
  AlertController,
  NavController,
  LoadingController,
  Platform,
} from "@ionic/angular";

import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import { Router } from "@angular/router";
import { BiometricWrapper } from '@awesome-cordova-plugins/biometric-wrapper/ngx';
import { UsuariService } from "src/app/services/usuari.service";
import { EventService } from "src/app/services/event.service";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { DeviceService } from "src/app/services/device.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from "firebase/auth";
import * as firebase from "firebase/app";
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { environment } from "src/environments/environment";
import {
  AvailableResult,
  BiometryType,
  NativeBiometric,
} from 'capacitor-native-biometric';
import { Console } from "console";
import { Constants } from "src/app/Constants";
@Component({
  selector: "login-page",
  templateUrl: "login.page.html",
  styleUrls: ["./login.page.scss"],
})
/**
 * Controlador per la pantalla Login
 */
export class LoginPage extends PaginaNavegacio implements OnInit {
  login: { nom?: string; contrasenya?: string } = {};
  enviat = false;
  bFingerPrint: boolean = false;
  bFingerPrintLoad: boolean = false;
  constructor(
    private googlePlus: GooglePlus,
    private platform: Platform,
    protected eventService: EventService,
    protected deviceService: DeviceService,
    usuariBs: UsuariBs,
    route: Router,
    navCtrl: NavController,
    toastCtrl: ToastController,
    alertCtrl: AlertController,
    loadingCtrl: LoadingController,
    storeData: StoreData,
    protected usuariService: UsuariService,
    private afAuth: AngularFireAuth
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
  /**
   * Carregar Pagina Principal
   * */
  ngOnInit() {
    this.bFingerPrint = false;
    this.bFingerPrintLoad = false;
    console.info("NgIni Login");
    this.checkCredential()
    console.info("NgIni Fin Login");
  }

  checkCredential() {
    NativeBiometric.isAvailable().then((result: AvailableResult) => {
      this.bFingerPrint = result.isAvailable;
      console.info('RESULT ' + JSON.stringify(result));
      // const isFaceId=result.biometryType==BiometryType.FACE_ID;
      // const isFaceId = result.biometryType == BiometryType.FACE_ID;

      if (this.bFingerPrint) {
        // Get user's credentials
        NativeBiometric.getCredentials({
          server: 'www.appinya.com',
        }).then((credentials) => {
          console.info('CREDENTIAL ' + JSON.stringify(credentials));
          // Authenticate using biometrics before logging the user in
          NativeBiometric.verifyIdentity({
            reason: 'Per un login fàcil',
            title: 'Autenticació',
            subtitle: 'Introduiex FingerPrint',
            description: `Introdueix l'emprenta per identificar- te`,
          })
            .then(() => {
              this
            })
            .catch((err) => {
              //   // Failed to authenticate
              alert('FAIL!');
            });
        });
      }
    });
  }

  /**
   * Boto Login
   * @param form
   */
  async onLogin(form: NgForm, saveBiometric: boolean) {
    if (!this.deviceService.teConexio()) {
      this.presentarMissatgeAmbConexio();
      return;
    }
    this.enviat = true;
    if (!this.login.contrasenya || !this.login.nom) return;

    let loading = await this.presentarCarregant(
      "Validant credencials al servidor"
    );
    loading.present();
    this.usuariService.login(this.login.nom, this.login.contrasenya).subscribe(
      async (tk) => {
        await this.storeData.desarUsuariSessio(tk);
        if (this.bFingerPrint && saveBiometric) {
          console.info("Desar dada biometrica");
          this.desarDadesBiometrica();
        }
        loading.dismiss();
        this.navegarAPagina(Constants.URL_INICIALITZAR);
      },
      (err) => {
        this.bFingerPrint = false;
        console.info(err);
        loading.dismiss();
        this.presentarAlerta(
          "Error a l'usuari o contrasenya",
          "Valida que l'usuari i la contrasenya siguin correctes."
        );
      }
    );
  }
  /**
   * Boto CanviarContrasenya
   * */
  onPerdreContrasenya() {
    this.navegarAPagina(Constants.URL_PERDRE_PASS);
  }
  /**
   * Desar dades Biometrica
   */
  async desarDadesBiometrica() {
    try {

      // Save user's credentials
      NativeBiometric.setCredentials({
        username: this.login.nom || "",
        password: this.login.contrasenya || "",
        server: 'www.appinya.com',
      }).then();
      this.presentarAlerta("Correcte", "S'ha guardat l'autentificació");
    } catch (e) {
      this.presentarAlerta("Erro", "S'ha guardat la autentificació");
    }
  }
  /**
   * Cercar Biometria
   */



  async loginGoogle() {
    try {
      let params: any;
      if (this.platform.is("cordova") && this.platform.is("ios")) {
        this.presentarAlerta(
          "Funció no disponible per IOS",
          "No tenim disponible aquesta funció per la versió IOS ... perdoneu les molesties (los pijos tambien lloran ;) ) "
        );
      } else if (this.platform.is("cordova") && this.platform.is("android")) {
        console.info("ANDROID!");
        this.presentarAlerta(
          "Funció no disponible per Android",
          "Funció no disponible per Android. Només es accesible desde la Web"
        );
        return;
        const res = await this.googlePlus.login({
          webClientId: environment.GoogleoAuth.client_id,
          offline: true,
        });
        const resConfirmed = await this.afAuth.signInWithCredential(
          GoogleAuthProvider.credential(res.idToken)
        );
        console.info(resConfirmed);

      } else {
        let result = await this.afAuth.signInWithPopup(
          new GoogleAuthProvider()
        );
        console.log("T'has loginejat correctament");

        let jwt = (result.user) ? await result.user.getIdToken() : null;
        let loading = await this.presentarCarregant(
          "Validant credencials al servidor"
        );
        if (jwt)
          this.usuariService.jwt(jwt).subscribe(
            async (tk) => {
              await this.storeData.desarUsuariSessio(tk.Retorn);

              loading.dismiss();
              this.navegarAPagina(Constants.URL_INICIALITZAR);
            },
            (err) => {
              this.bFingerPrint = false;
              console.info(err);
              loading.dismiss();
              this.presentarAlerta(
                "Error a l'usuari",
                "Valida que l'usuari siguin correctes. "
              );
            }
          );
      }
    } catch (error) {
      console.log(error);
      this.presentarAlerta(
        "Error al activar Google",
        "Contacti amb l'administrador."
      );
    }
  }
}
