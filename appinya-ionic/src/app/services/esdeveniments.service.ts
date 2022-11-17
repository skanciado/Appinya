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

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map, timeout } from "rxjs/operators";
import {
  IEsdevenimentCastellModel,
  IEsdevenimentDetallModel,
  IEsdevenimentModel,
  IEsdevenimentModelList,
  IEsdevenimentResumModel,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariSessio,
  PeticioActualitzacioId,
} from "../entities/interfaces";
import { RestService } from "./RestBase.service";
import { StoreData } from "./storage.data";
@Injectable({
  providedIn: "root",
})
export class EsdevenimentService extends RestService {
  constructor(protected http: HttpClient, protected store: StoreData) {
    super(http, store);
  }

  /**
   * Metode de REST per a obtenir el detall de l esdeveniment
   */
  obtenirDetallEsdeveniments(
    idEsdeveniment: String,
    user: IUsuariSessio
  ): Observable<IEsdevenimentDetallModel> {
    let esdeveniments$ = this.http.get<IEsdevenimentDetallModel>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/${idEsdeveniment}`,
      this.obtenirHeaders(user)
    );
    return esdeveniments$;
  }
  /**
   * Detall Actualitzacio
   * @param paquet
   * @param user
   * @returns
   */
  obtenirDetallActualitzacioEsdeveniments(
    paquet: PeticioActualitzacioId,
    user: IUsuariSessio
  ): Observable<IEsdevenimentDetallModel> {
    let esdeveniments$ = this.http.post<IEsdevenimentDetallModel>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/actualitzacio`,
      paquet,
      this.obtenirHeaders(user)
    );
    return esdeveniments$;
  }
  /**
   * Obtenir Esdeveniments
   * @param user
   * @returns
   */
  obtenirEsdeveniments(
    user: IUsuariSessio
  ): Observable<IEsdevenimentResumModel[]> {
    let esdeveniments$ = this.http.get<IEsdevenimentResumModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/cercar`,
      this.obtenirHeaders(user)
    );
    return esdeveniments$;
  }
  /**
   * OBtenir Esdeveniment Actuals
   * @param text
   * @param tipus
   * @param regIni
   * @param user
   * @returns
   */
  obtenirEsdevenimentsActuals(
    text: String,
    tipus: String[],
    regIni: number,
    user: IUsuariSessio
  ): Observable<IEsdevenimentResumModel[]> {
    let esdeveniments$ = this.http.post<IEsdevenimentResumModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/actuals`,
      { RegIni: regIni, Text: text, Opcions: tipus.join(";") },
      this.obtenirHeaders(user)
    );

    return esdeveniments$;
  }
  /**
   *
   * @param text Obtenir Esdeveniment Historic
   * @param tipus
   * @param regIni
   * @param user
   * @returns
   */
  obtenirEsdevenimentsHistoric(
    text: String,
    tipus: String[],
    regIni: number,
    user: IUsuariSessio
  ): Observable<IEsdevenimentResumModel[]> {
    let esdeveniments$ = this.http.post<IEsdevenimentResumModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/historic`,
      { RegIni: regIni, Text: text, Opcions: tipus.join(";") },
      this.obtenirHeaders(user)
    );
    return esdeveniments$;
  }
  /**
   * Metodo de REST para crear o modificar esdevemiments
   */
  desarEsdeveniment(
    esd: IEsdevenimentModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<IEsdevenimentModel>> {
    let public$ = this.http.post<
      IRespostaServidorAmbRetorn<IEsdevenimentModel>
    >(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments`,
      JSON.stringify(esd),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para esborrar esdeveniments
   */
  esborrarEsdeveniment(
    esd: IEsdevenimentModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/${esd.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }

  /**
   * Metodo de REST para Bloquejar Esdeveniments
   */
  bloquejarEsdeveniment(
    esd: IEsdevenimentModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/bloquejar/${esd.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para DesBloquejar Esdeveniments
   */
  desBloquejarEsdeveniment(
    esd: IEsdevenimentModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/desbloquejar/${
        esd.Id
      }`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para Anular Esdeveniments
   */
  anularEsdeveniment(
    esd: IEsdevenimentModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/anular/${esd.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para Anular Esdeveniments
   */
  activarEsdeveniment(
    esd: IEsdevenimentModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/activar/${esd.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Modificar el castell
   * @param esd
   * @param user
   * @returns
   */
  modificarCastell(
    esd: IEsdevenimentCastellModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<IEsdevenimentCastellModel>> {
    let public$ = this.http.post<
      IRespostaServidorAmbRetorn<IEsdevenimentCastellModel>
    >(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/castell`,
      JSON.stringify(esd),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Esborrar Castell d'un esdeveniment
   * @param esd
   * @param user
   * @returns
   */
  esborrarCastell(
    esd: IEsdevenimentCastellModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/esdeveniments/castell/${esd.Id}`,

      this.obtenirHeaders(user)
    );

    return public$;
  }
}
