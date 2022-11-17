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
import { ICastellerDetallModel, ICastellerModel, IResponsableLegalModel, IRespostaServidor, IRespostaServidorAmbRetorn, ITemporadaModel, IUsuariSessio } from '../entities/interfaces';
import { RestService } from './RestBase.service'; 
import { StoreData } from './storage.data'; 
@Injectable({
  providedIn: 'root',
})
export class CastellersService extends RestService {

  constructor(
    protected http: HttpClient,
    protected store: StoreData ) {
    super(http, store );
  }
   
  /**
   * Metode per modificar les dades de la camisa
   * @param cas
   */
  teCamisa(cas: ICastellerModel,user: IUsuariSessio ): Observable<IRespostaServidor> {

    let public$ = this.http.post<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/teCamisa`, JSON.stringify(cas), this.obtenirHeaders(user))
    
    return public$;

  }
  /**
   * Metode per guardar els canvis d un casteller
   * @param cas
   */
  desarCasteller(cas: ICastellerModel,user: IUsuariSessio ): Observable<IRespostaServidorAmbRetorn<ICastellerModel>> {

    let public$ = this.http.post<IRespostaServidorAmbRetorn<ICastellerModel>>(`${this.obtenirURLServidor()}/api/v1.0/castellers`, JSON.stringify(cas), this.obtenirHeaders(user))
    
    return public$;

  }
   /**
   * Metode per esborrar un casteller
   * @param cas
   */
  esborrarCasteller(cas: ICastellerModel ,user: IUsuariSessio ): Observable<IRespostaServidor> {

    let public$ = this.http.delete<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/${cas.Id}` , this.obtenirHeaders(user))
     
    return public$;

  }
  /**
  * Metodo Crear  ReferenciatTecnic
  */
  crearReferenciatTecnic(cas: ICastellerModel,user: IUsuariSessio  ): Observable<IRespostaServidor> {

    let public$ = this.http.post<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/solicitud/${cas.Id}`,null, this.obtenirHeaders(user))
     
    return public$;

  } 
   /**
  * Metodo Crear  ReferenciatTecnic
  */
 esborrarReferenciatTecnic(cas: ICastellerModel,user: IUsuariSessio  ): Observable<IRespostaServidor> {

  let public$ = this.http.delete<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/solicitud/${cas.Id}`, this.obtenirHeaders(user))
   
  return public$;

} 
  /**
  * Metodo crear delegacio castellers
  */
 crearDelegacioAdministrativa(idCastellerEmisor: string,idCastellerReceptor:string,user: IUsuariSessio  ): Observable<IRespostaServidor> {

  let public$ = this.http.put<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/delegacio`, 
  {
    Emisor:idCastellerEmisor,
    Receptor:idCastellerReceptor
  }, this.obtenirHeaders(user))
   
  return public$; 
}  
/**
* Metodo crear delegacio castellers
*/
esborrarDelegacioAdministrativa(idCastellerEmisor: string,idCastellerReceptor:string ,user: IUsuariSessio ): Observable<IRespostaServidor> {

let public$ = this.http.delete<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/delegacio`, 
 this.obtenirHeaders(user,{
  Emisor:idCastellerEmisor,
  Receptor:idCastellerReceptor
}))
 
return public$; 
} 
   
  /**
   * Guardar un responsable legal d'un casteller
   * @param res
   */
  desarResponsableLegal(res: IResponsableLegalModel,user: IUsuariSessio ): Observable<IRespostaServidorAmbRetorn<IResponsableLegalModel>> { 
    let casteller$ = this.http.post<IRespostaServidorAmbRetorn<IResponsableLegalModel>>(`${this.obtenirURLServidor()}/api/v1.0/castellers/responsableLegal`, JSON.stringify(res), this.obtenirHeaders(user))
     
    return casteller$; 
  }
  /**
   * Esborrar un responsable legal d'un casteller
   * @param idCasteller
   * @param idTipusResponsable
   */
  esborrarResponsableLegal(idCasteller: string ,idTipusResponsable:string,user: IUsuariSessio  ): Observable<IRespostaServidor> {
    let casteller$ = this.http.delete<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/responsableLegal/${idCasteller}/${idTipusResponsable}`, this.obtenirHeaders(user))
     
    return casteller$;

  }

  crearDelegacio(receptor: ICastellerModel, emisor: ICastellerModel,user: IUsuariSessio ): Observable<IRespostaServidor> {

    let casteller$ = this.http.post<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/delegacio`, JSON.stringify({ emisor: emisor.Id, receptor: receptor.Id }), this.obtenirHeaders(user))
     
    return casteller$; 
  }

  esborrarDelegacio(receptor: ICastellerModel, emisor: ICastellerModel,user: IUsuariSessio ): Observable<IRespostaServidor> { 
    let casteller$ = this.http.delete<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/delegacio`,this.obtenirHeaders(user, JSON.stringify({ emisor: emisor.Id, receptor: receptor.Id })))
    
    return casteller$; 
  }
  obtenirCasteller(id:string,user: IUsuariSessio ):Observable<ICastellerModel> {
    let casteller$ = this.http.get<ICastellerModel>(`${this.obtenirURLServidor()}/api/v1.0/castellers/${id}`, this.obtenirHeaders(user))
     
    return casteller$;
  }
  /**
   * Retorna tota la base de dades de  castellers
   * */
  obtenirCastellers(user: IUsuariSessio ): Observable<ICastellerModel[]> {
     
    let casteller$ = this.http.get<ICastellerModel[]>(`${this.obtenirURLServidor()}/api/v1.0/castellers/cercar`, this.obtenirHeaders(user))
     
    return casteller$;

  }
  /**
   * Retorna informació del casteller associada com rols usuari, estadistica completa .....
   * @param idCasteller
   */
  ObtenirCastellerDetall(idCasteller: string,user: IUsuariSessio ): Observable<ICastellerDetallModel> {

    let casteller$ = this.http.get<ICastellerDetallModel>(`${this.obtenirURLServidor()}/api/v1.0/castellers/usuari/${idCasteller}`, this.obtenirHeaders(user))
     
    return casteller$;

  }

  /**
   * Retorna informació del casteller associada com rols usuari, estadistica completa .....
   * @param idCasteller
   */
  ObtenirCastellerDetallPerUsuari(user: IUsuariSessio ): Observable<ICastellerDetallModel> {

    let casteller$ = this.http.get<ICastellerDetallModel>(`${this.obtenirURLServidor()}/api/v1.0/castellers/usuari`, this.obtenirHeaders(user))
    
    return casteller$;

  }

  /**
   * Enviar un correo amb l'exportacio de la base de dades de castells
   * */
  enviarCorreuExportacio(user: IUsuariSessio ): Observable<IRespostaServidor> {

    let getToken$ = this.http.post<IRespostaServidor>(`${this.obtenirURLServidor()}/api/v1.0/castellers/export`, null, this.obtenirHeaders(user))
     
    return getToken$;

  } 
}



