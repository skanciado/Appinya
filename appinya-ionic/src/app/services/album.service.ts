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
  IAlbumsModel,
  ILikesHelper,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariSessio,
} from "../entities/interfaces";
import { RestService } from "./RestBase.service";
import { StoreData } from "./storage.data";
/**
 * Servei de comunicació amb el servidor
 * */
@Injectable({
  providedIn: "root",
})
export class AlbumService extends RestService {
  constructor(
    http: HttpClient,
    store: StoreData
  ) {
    super(http, store);
  }

  /**
   * Retorna les fotos de la temporada actual
   * */
  obtenirAlbums(
    temporadaId: number,
    user: IUsuariSessio
  ): Observable<IAlbumsModel[]> {
    let public$ = this.http.get<IAlbumsModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/album/cercar/${temporadaId}`,
      this.obtenirHeaders(user)
    );
    return public$;
  }

  /**
   * Metodo de REST para crear o modificar Fotos
   * @param fot fotobrafia a modificar
   * @param loading recurs gràfic de cargant
   */
  desarAlbum(
    fot: IAlbumsModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<IAlbumsModel>> {
    let public$ = this.http.post<IRespostaServidorAmbRetorn<IAlbumsModel>>(
      `${this.obtenirURLServidor()}/api/v1.0/album`,
      JSON.stringify(fot),
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Metodo de REST para esborrar Fotos
   * @param fot fotobrafia a modificar
   * @param loading recurs grafic de cargant
   */
  esborrarAlbum(
    fot: IAlbumsModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let public$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/album/${fot.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Agregar un like a una foto
   * @param fot foto objecte del like
   * @param loading recurs grafic de cargant
   */
  obtenirAlbum(idAlbum: string, user: IUsuariSessio): Observable<IAlbumsModel> {
    let public$ = this.http.get<IAlbumsModel>(
      `${this.obtenirURLServidor()}/api/v1.0/album/${idAlbum}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Agregar un like a una foto
   * @param fot foto objecte del like
   * @param loading recurs grafic de cargant
   */
  like(
    fot: IAlbumsModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<number>> {
    let public$ = this.http.get<IRespostaServidorAmbRetorn<number>>(
      `${this.obtenirURLServidor()}/api/v1.0/album/like/${fot.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Esborra el like a una foto
   * @param fot foto objecte del like
   * @param loading recurs grafic de cargant
   */
  eliminarLike(
    fot: IAlbumsModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<number>> {
    let public$ = this.http.delete<IRespostaServidorAmbRetorn<number>>(
      `${this.obtenirURLServidor()}/api/v1.0/album/like/${fot.Id}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
  /**
   * Obtenir els Likes de totes les fotos
   * @param loading
   */
  obtenirLikes(
    idTemporada: number,
    user: IUsuariSessio
  ): Observable<ILikesHelper[]> {
    idTemporada = idTemporada ? idTemporada : 0;
    let public$ = this.http.get<ILikesHelper[]>(
      `${this.obtenirURLServidor()}/api/v1.0/album/likes/${idTemporada}`,
      this.obtenirHeaders(user)
    );

    return public$;
  }
}
