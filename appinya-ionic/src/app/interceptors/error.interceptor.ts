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

import { Injectable, ErrorHandler } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AuthenticateService } from "../services/authenticate.service";
import {
  ErrorGeneric,
  ErrorRefrescarCredencials,
  ErrorSenseInternet,
  ErrorLocalStore,
  ErrorTemporadaBuida,
} from "../entities/Errors";
import { StoreData } from "../services/storage.data";
import { EventService } from "../services/event.service";
import { Constants } from "../Constants";
@Injectable({
  providedIn: "root",
})
/**
 * Interceptador d'errors Generic de la app
 */
export class ErrorIntercept implements ErrorHandler {
  constructor(
    protected eventService: EventService,
    protected navCtrl: NavController,
    protected authenticateService: AuthenticateService,
    protected store: StoreData
  ) { }
  /**
   * Event Handler para recoger todos los errores de la app
   * @param error 
   */
  async handleError(error: any) {
    error = error.rejection ?? error;
    if (error instanceof ErrorRefrescarCredencials) {
      let user = await this.store.obtenirUsuariSession();
      this.authenticateService.refreshToken(user).subscribe(
        (t) => {
          if (t) {
            console.info("Credencials actualitzades");
            this.store.desarUsuariSessio(t);
          } else {
            this.store.cleanMemoria();
            console.info("Enviar al login");
            this.navCtrl.navigateRoot(Constants.URL_ACCES);
          }
        },
        (e) => {
          console.info("Error de credencials");
          this.navCtrl.navigateRoot(Constants.URL_ACCES);
        }
      );
      console.error("AppinyaError Error: " + error.missatge);
    } else if (error instanceof ErrorTemporadaBuida) {
      console.error("AppinyaError Error: " + error.missatge);
      this.eventService.enviarEventError(error.missatge);
      this.store.cleanMemoria();
      this.navCtrl.navigateRoot(Constants.URL_ACCES);
    } else if (error instanceof ErrorLocalStore) {
      console.error("AppinyaError Error: " + error.missatge);
      this.eventService.enviarEventError(error.missatge);
    } else if (error instanceof ErrorSenseInternet) {
      this.eventService.enviarEventSenseConexio();
    } else if (error instanceof ErrorGeneric) {
      console.error("AppinyaError Error: " + error.missatge);
      this.eventService.enviarEventError(error.missatge);
    } else if (error.rejection) {
      console.error(error);
      this.eventService.enviarEventError(error);
    }
  }
}
