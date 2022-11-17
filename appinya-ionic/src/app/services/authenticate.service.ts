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
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map, timeout } from "rxjs/operators";
import {
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariModel,
  IUsuariSessio,
} from "../entities/interfaces";
import { RestService } from "./RestBase.service";
import { StoreData } from "./storage.data";
/**
 * Clase responsable de les accions de l usuari sobre el seu compte
 */
@Injectable({
  providedIn: "root",
})
export class AuthenticateService extends RestService {
  constructor(protected http: HttpClient, protected store: StoreData) {
    super(http, store);
  }
  /**
   * Metodo para cambiar el password
   * @param oldpass
   * @param newpass
   * @param confirmpass
   */
  canviarContrasenya(
    usuari: String,
    oldpass: String,
    newpass: String,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let changePass$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/autenticacio/password`,
      JSON.stringify({
        Usuari: usuari,
        PasswordActual: oldpass,
        PasswordNou: newpass,
      }),
      this.obtenirHeaders(user)
    );

    return changePass$;
  }
  /**
   * Funció per enviar un correo per resetejar contrasenya
   * @param user
   */
  oblidarConstrasenya(usuari: String): Observable<IRespostaServidor> {
    let oblidarContrasenya$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/autenticacio/contrasenya/oblidar?email=` +
        usuari,
      this.obtenirHeaders(null)
    );

    return oblidarContrasenya$;
  }

  /**
   * Esborrar un usuari actiu de l'aplicació
   * @param user
   */
  esborrarUsuari(
    usuari: IUsuariModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/autenticacio/usuari`,
      this.obtenirHeaders(user, JSON.stringify(usuari))
    );

    return public$;
  }
  /**
   * Peticio al servidor per enviar les instruccions per confirmar el correu de l'usuari
   * @param user
   */
  confirmarCorreu(user: IUsuariSessio): Observable<IRespostaServidor> {
    let public$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/autenticacio/confirmarCorreu?email=${
        user.Email
      }`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Canviar els permisos de l'usuari
   * @param email
   * @param rols
   */
  desarRoles(
    email: string,
    rols: String[],
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    //backoffice/canviaPermisos
    let public$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/autenticacio/rols/assignar`,
      JSON.stringify({
        Email: email,
        Rols: rols,
      }),
      this.obtenirHeaders(user)
    );

    return public$;
  }
}
