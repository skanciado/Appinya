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


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map, timeout } from 'rxjs/operators'; 
import { IControlDeVersio, ITemporadaModel } from '../entities/interfaces';
import { RestService } from './RestBase.service'; 
import { StoreData } from './storage.data';
import { Platform } from '@ionic/angular';
/**
 * Classe responsable d'envia peticions al servidor per validar la versio instalada
 */
@Injectable({
  providedIn: 'root',
})
export class ControlDeVersioService extends RestService {

  constructor(
    protected http: HttpClient,
    protected store: StoreData, 
    protected platform: Platform) {
    super(http, store );
  }
  /**
   * Check de versió en el servidor
   */
  checkVersio(versio:string): Observable<IControlDeVersio> {

    let checkVersio$ = this.http.get<IControlDeVersio>(`${this.obtenirURLServidor()}/api/v1.0/controldeversio/validar?versioDB=${this.store.obtenirVersioDB()}&versioApp=${versio}`, this.obtenirHeaderSenseAutentificacio())
    
    return checkVersio$;

  }

  obtenir(): Observable<IControlDeVersio> {

    let checkVersio$ = this.http.get<IControlDeVersio>(`${this.obtenirURLServidor()}/api/v1.0/controldeversio`, this.obtenirHeaderSenseAutentificacio())
   
    return checkVersio$;

  }


}

