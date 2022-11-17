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
import { Observable } from "rxjs";
import { StoreData } from "./storage.data";
import { Platform } from "@ionic/angular";
import { RestService } from "./RestBase.service";
import { HttpClient } from "@angular/common/http";
import {
  ICastellerModel,
  IEstadisticaIndividualModel,
  IRespostaServidor,
  IRespostaServidorAmbRetorn,
  ITemporadaModel,
  IUsuariModel,
  IUsuariSessio,
} from "../entities/interfaces";

/**
 * Classe responsable de les comunicacions de l usuari sobre el seu compte
 */
@Injectable({
  providedIn: "root",
})
export class UsuariService extends RestService {
  constructor(
    protected http: HttpClient,
    protected store: StoreData,
    protected platform: Platform
  ) {
    super(http, store);
  }
  /**
   * Metode per a enviar l email de confirmacio per a validar l email
   * @param oldpass
   * @param newpass
   * @param confirmpass
   */
  confirmacioEmail(email: String, user: IUsuariSessio): Observable<any> {
    let enviarConfirmacio$ = this.http.post(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/email/confirmar?usuari=${email}`,
      this.obtenirHeaders(user)
    );

    return enviarConfirmacio$;
  }

  /**
   * Recull la informacio del Usuari actualitzada
   * @param tk
   */
  obtenirUsuariInfo(user: IUsuariSessio): Observable<IUsuariModel> {
    let u$ = this.http.get<IUsuariModel>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/usuariactual`,
      this.obtenirHeaders(user)
    );

    return u$;
  }
  /**
   * Recull la informacio del Usuari actualitzada
   * @param tk
   */
  obtenirUsuari(email: string, user: IUsuariSessio): Observable<IUsuariModel> {
    let u$ = this.http.get<IUsuariModel>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/?email=${encodeURIComponent(
        email
      )}`,
      this.obtenirHeaders(user)
    );

    return u$;
  }
  /**
   * Recull la informacio del Usuari actualitzada
   * @param tk
   */
  obtenirUsuariActual(user: IUsuariSessio): Observable<IUsuariModel> {
    let token$ = this.http.get<IUsuariModel>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/usuariactual`,
      this.obtenirHeaders(user)
    );

    return token$;
  }
  /**
   * Funcio per relacionar l'usuari amb un casteller
   * @param user
   */
  relacionarCastellerAmbUsuari(
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<IUsuariModel>> {
    let oblidarContrasenya$ = this.http.get<
      IRespostaServidorAmbRetorn<IUsuariModel>
    >(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/relacionar`,
      this.obtenirHeaders(user)
    );

    return oblidarContrasenya$;
  }
  /**
   * Metode per enviar el correu de support
   * @param message
   */
  enviarEmailSuport(message: String, user: IUsuariSessio): Observable<any> {
    let sendSuport$ = this.http.post(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/email/suport`,
      JSON.stringify(message),
      this.obtenirHeaders(user)
    );

    return sendSuport$;
  }
  /**
   * Metode per enviar el correu de support
   * @param message
   */
  enviarEmailConformacioDades(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<any> {
    let message =
      `<br/>Casteller: ${cas.Alias}` +
      `<br/>Nom: ${cas.Nom} ${cas.Cognom}` +
      `<br/>Telèfon 1: ${cas.Telefon1}` +
      `<br/>Telèfon 2: ${cas.Telefon2}` +
      `<br/>Email: ${cas.Email}` +
      `<br/>Direcció: ${cas.CodiPostal} ${cas.Provincia}, ${cas.Direccio} `;
    let sendSuport$ = this.http.post(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/email/comisio/10`,
      JSON.stringify(message),
      this.obtenirHeaders(user)
    );

    return sendSuport$;
  }
  /**
   * Metode per enviar el correu de una comisio
   * @param message
   */
  enviarEmailComisio(
    qui: string,
    message: string,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let sendSuport$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/email/comisio/${qui}`,
      JSON.stringify(message),
      this.obtenirHeaders(user)
    );

    return sendSuport$;
  }
  /**
   * Guarda la foto a la base de dades
   * @param foto
   */
  desarFotoByCasteller(
    foto: String,
    idCasteller: string,
    user: IUsuariSessio
  ): Observable<IRespostaServidorAmbRetorn<string>> {
    let foto$ = this.http.post<IRespostaServidorAmbRetorn<string>>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/desarFoto/${idCasteller}`,
      JSON.stringify(foto),
      this.obtenirHeaders(user)
    );

    return foto$;
  }
  /**
   * Metodo de REST para obtener el listado de Noticias
   */
  obtenirListUsuari(
    text: string,
    excludeTypes: string,
    reg: number,
    user: IUsuariSessio
  ): Observable<IUsuariModel[]> {
    let public$ = this.http.post<IUsuariModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/cercar`,
      JSON.stringify({
        RegIni: reg,
        Text: text,
        Opcions: excludeTypes,
      }),
      this.obtenirHeaders(user)
    );

    return public$;
  }

  /**
   * Enviar invitació d'un casteller logineixat a un altre
   * @param cas
   */
  crearUsuari(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let casteller$ = this.http.put<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/${cas.Id}`,
      JSON.stringify(cas),
      this.obtenirHeaders(user)
    );

    return casteller$;
  }

  /**
   * Enviar invitació d'un casteller logineixat a un altre
   * @param cas
   */
  enviaInvitacio(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let casteller$ = this.http.put<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/invitacio/${cas.Id}`,
      JSON.stringify(cas),
      this.obtenirHeaders(user)
    );

    return casteller$;
  }
  /**
   * Esborra la invitacio del casteller logineixat d'una invitacio d'un altre casteller
   * @param cas
   */
  esborrarInvitacio(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let casteller$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/invitacio/${cas.Id}`,
      this.obtenirHeaders(user)
    );

    return casteller$;
  }

  /**
   * Esborra la invitacio del casteller logineixat que ell ha enviat
   * @param cas
   */
  esborrarSolicitud(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let casteller$ = this.http.delete<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/solicitud/${cas.Id}`,
      this.obtenirHeaders(user)
    );

    return casteller$;
  }
  /**
   * Crea un referent al tecnic
   * @param cas
   */
  acceptarInvitacio(
    cas: ICastellerModel,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let casteller$ = this.http.post<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/solicitud/${cas.Id}`,
      cas.Id,
      this.obtenirHeaders(user)
    );

    return casteller$;
  }

  /**
   * Activar o desactiva rebre correos de noticies noves
   * @param rebre
   */
  rebreCorreusNoticies(
    rebre: boolean,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let signUp1$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/rebre/noticies?rebre=${rebre}`,
      this.obtenirHeaders(user)
    );

    return signUp1$;
  }
  /**
   * Activar o desactiva rebre correos de fotos noves
   * @param rebre
   */
  rebreCorreuFotos(
    rebre: boolean,
    user: IUsuariSessio
  ): Observable<IRespostaServidor> {
    let signUp1$ = this.http.get<IRespostaServidor>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/rebre/noticies?rebre=${rebre}`,
      this.obtenirHeaders(user)
    );

    return signUp1$;
  }
  /**
   * Obtenir Estadistica
   * @param temporada
   */
  obtenirEstadistica(
    temporada: ITemporadaModel,
    user: IUsuariSessio
  ): Observable<IEstadisticaIndividualModel[]> {
    let temporada$ = this.http.get<IEstadisticaIndividualModel[]>(
      `${this.obtenirURLServidor()}/api/v1.0/usuari/estadistica${temporada.Id}`,
      this.obtenirHeaders(user)
    );

    return temporada$;
  }
}
