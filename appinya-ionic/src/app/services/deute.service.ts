/**
 *  Appinya Open Source Project
 *  Copyright (C) 2021 Daniel Horta Vidal
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
import { RestService } from "./RestBase.service";
import { StoreData } from "./storage.data";
import {
  IDeuteModel,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  IUsuariSessio,
} from "../entities/interfaces";
/**
 * Servei de comunicació amb el servidor
 * */
@Injectable({
  providedIn: "root",
})
export class DeuteService extends RestService {
  constructor(protected http: HttpClient, protected store: StoreData) {
    super(http, store);
  }

  /**
   * Retorna totes les fotos
   * @param idCasteller idCasteller si es 0 son tots
   * @param pagat si vols els pagats també
   * @param loading
   */
  obtenirDeutesPaginades(
    concepte: String,
    idCasteller: string,
    pagats: boolean,
    regIni: number,
    user: IUsuariSessio
  ): Observable<IDeuteModel[]> {
    let public$ = this.http.post<IDeuteModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/deutes/cerca`,
      JSON.stringify({
        RegIni: regIni,
        Text: concepte,
        Opcions: idCasteller + ";" + pagats,
      }),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Obtenir Deutes de l'usuari
   * @param user
   * @returns
   */
  obtenirDeutesUsuari(user: IUsuariSessio): Observable<IDeuteModel[]> {
    let public$ = this.http.get<IDeuteModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/deutes/usuariactual`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Obtenir Deutes per casteller
   * @param idCasteller
   * @param user
   * @returns
   */
  obtenirDeutes(
    idCasteller: string,
    user: IUsuariSessio
  ): Observable<IDeuteModel[]> {
    let public$ = this.http.get<IDeuteModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/deutes/casteller/${idCasteller}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para crear o modificar Deute
   * @param deu deute a modificar
   * @param loading recurs gràfic de cargant
   */
  desar(
    deu: IDeuteModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<IDeuteModel>> {
    let public$ = this.http.post<IRespostaServidorAmbRetorn<IDeuteModel>>(
      `${this.obtenirURLServidor()}/api/v1.0/deutes`,
      JSON.stringify(deu),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Esborrar deute
   * @param deu deute
   * @param loading
   */
  esborrar(
    deu: IDeuteModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/deutes/${deu.IdDeute}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
}
