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
import { Constants } from "../Constants";
import {
  IEstadisticaIndividualModel,
  IEsdevenimentModel,
  IAssistenciaModel,
  IRespostaServidor,
  IAssistenciaModelList,
} from "../entities/interfaces";
import { AssistenciaService } from "../services/assistencia.service";
import { StoreData } from "../services/storage.data";
import { UsuariService } from "../services/usuari.service";
import { UsuariBs } from "./Usuari.business";

/**
 * Obtenir Assitencia Negoci
 */
@Injectable({
  providedIn: "root",
})
export class AssistenciaBs {
  constructor(
    protected usuariBs: UsuariBs,
    protected assistenciaService: AssistenciaService,
    protected usuariService: UsuariService,
    protected storeData: StoreData
  ) {}

  estadisticaCasteller: IEstadisticaIndividualModel[] = [];
  /**
   * Obtenir la Estadistica individual del usuari conectat (requiere conexion)
   * Pot retornar un error ERROR_MSG_SENSE_CONEXIO
   * */
  public async obtenirEstadisticaIndividual(): Promise<
    IEstadisticaIndividualModel[]
  > {
    let user = await this.storeData.obtenirUsuariSession();
    let temporada = await this.storeData.obtenirTemporada();
    if (this.estadisticaCasteller.length > 0) {
      this.usuariService.obtenirEstadistica(temporada, user).subscribe((t) => {
        this.estadisticaCasteller = t;
      });
      return this.estadisticaCasteller;
    } else {
      this.usuariService.obtenirEstadistica(temporada, user).subscribe((t) => {
        this.estadisticaCasteller = t;
        return this.estadisticaCasteller;
      });
    }
  }

  /**
   * Retorna la assitencia que usuari conectat al aplicació
   * Pot retornar un error ERROR_MSG_SENSE_CONEXIO
   * */
  public async obtenirAssistenciaUsuari(): Promise<IAssistenciaModel[]> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<IAssistenciaModel[]>((resolve, reject) => {
      this.assistenciaService.obtenirAssistenciaCasteller(user).subscribe(
        (t) => {
          resolve(t);
        },
        (e) => {
          reject(Constants.ERROR_MSG_SENSE_CONEXIO);
        }
      );
    });
    return promise;
  }
  /**
   * Retorna la assistencia d'un casteller
   * Pot retornar un error ERROR_MSG_SENSE_CONEXIO
   * @param idCasteller - Identificador del casteller
   */
  public async obtenirAssistenciaCasteller(
    idCasteller: string
  ): Promise<IAssistenciaModel[]> {
    let user = await this.storeData.obtenirUsuariSession();

    var promise = new Promise<IAssistenciaModel[]>((resolve, reject) => {
      this.assistenciaService
        .obtenirAssistenciaCastellerPerIdCasteller(idCasteller, user)
        .subscribe(
          (t) => {
            resolve(t);
          },
          (e) => {
            reject(Constants.ERROR_MSG_SENSE_CONEXIO);
          }
        );
    });
    return promise;
  }
  /**
   * Retorna la estadistica Individual d'un  casteller
   * @param idCasteller El identificador del casteller
   * @param loading El PopUp Loading pot ser null
   */
  public async obtenirEstadisticaCasteller(
    idCasteller: string
  ): Promise<IEstadisticaIndividualModel[]> {
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .obtenirEstadistica(idCasteller, user)
      .toPromise();
  }

  /**
   * Envia un correu electronic amb la extracció de l'assitencia de l'esdeveniment
   * @param esdeveniment esdeveniment associat
   */
  public async exportarExcelAssitencia(
    idEsdeveniment: string
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .enviarCorreuExportacio(idEsdeveniment, user)
      .toPromise();
  }
  /**
   * Envia un correu electronic amb la extracció de l'assitencia d una temporada
   * @param idTemporada temporada associada
   */
  public async exportarExcelAssistenciaGlobalDetall(
    idTemporada: number
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .enviarCorreuExportacioAssistenciaGlobalDetall(idTemporada, user)
      .toPromise();
  }
  /**
   * Envia un correu electronic amb la extracció de l'assitencia  d una temporada
   * @param idTemporada temporada associada
   */
  public async exportarExcelAssistenciaGlobalResum(
    idTemporada: number
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .enviarCorreuExportacioAssistenciaGlobalResum(idTemporada, user)
      .toPromise();
  }
  /**
   * Confirmar assistencia d'un delegat o referent
   * @param delegat delegat o referent
   */
  public async confirmarAssistenciaDelegat(
    delegat: IAssistenciaModel
  ): Promise<IRespostaServidor> {
    let lstAssistencia: IAssistenciaModel[] = [
      <IAssistenciaModel>{
        Casteller: delegat.Casteller,
        Esdeveniment: delegat.Esdeveniment,
        NumAcompanyants: delegat.NumAcompanyants,
        Transport: delegat.Transport,
        TransportAnada: delegat.TransportAnada,
        TransportTornada: delegat.TransportTornada,
        Preguntes: delegat.Preguntes,
        Observacions: delegat.Observacions,
        Assistire: delegat.Assistire,
      },
    ];
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .confirmarAssistencia(lstAssistencia, user)
      .toPromise();
  }
  /**
   * Confirmar assistencia de forma personal
   * @param idEsdeveniment
   * @param assistencia
   */
  public async confirmarAssistenciaPersonal(
    idEsdeveniment: String,
    assistencia: boolean
  ): Promise<IRespostaServidor> {
    let lstAssistencia: IAssistenciaModel[] = [];
    let userM = await this.storeData.obtenirUsuari();
    let user = await this.storeData.obtenirUsuariSession();
    lstAssistencia.push(<IAssistenciaModel>{
      Casteller: userM.CastellerId,
      Esdeveniment: idEsdeveniment,
      NumAcompanyants: 0,
      Transport: null,
      Observacions: null,
      TransportAnada: null,
      TransportTornada: null,
      Preguntes: [],
      Assistire: assistencia ? true : false,
    });
    return this.assistenciaService
      .confirmarAssistencia(lstAssistencia, user)
      .toPromise();
  }
  /**
   * Confirmar la assistencia d' un esdveniment
   * @param personal assistencia personal del casteller
   * @param delegats delegats associats al casteller
   * @param referenciats referents en el cas de ser tecnica
   * @param showLoading Si es vol mostrar un missatge de carrega mentres s envia al servidor
   */
  public async confirmarAssistenciaFormulari(
    personal: IAssistenciaModel,
    delegats: IAssistenciaModel[],
    referenciats: IAssistenciaModel[]
  ): Promise<IRespostaServidor> {
    let lstAssistencia: IAssistenciaModel[] = [];

    lstAssistencia.push(personal);

    // Delegació d'assisentcia'
    delegats.forEach((t) => {
      if (t.ConfirmacioTecnica == false)
        lstAssistencia.push(<IAssistenciaModel>{
          Casteller: t.Casteller,
          Esdeveniment: personal.Esdeveniment,
          NumAcompanyants: t.NumAcompanyants,
          Transport: t.Transport,
          Observacions: t.Observacions,
          TransportAnada: t.TransportAnada,
          TransportTornada: t.TransportTornada,
          Preguntes: t.Preguntes,
          Assistire: t.Assistire,
        });
    });

    // Referenciats
    referenciats.forEach((t) => {
      if (t.ConfirmacioTecnica == false)
        lstAssistencia.push(<IAssistenciaModel>{
          Casteller: t.Casteller,
          Esdeveniment: personal.Esdeveniment,
          NumAcompanyants: t.NumAcompanyants,
          Transport: t.Transport,
          Observacions: t.Observacions,
          Assistire: t.Assistire,
          TransportAnada: t.TransportAnada,
          TransportTornada: t.TransportTornada,
          Preguntes: t.Preguntes,
        });
    });
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .confirmarAssistencia(lstAssistencia, user)
      .toPromise();
  }
  /**
   * Confirmacio assitencia d'un usuari sense ser tecnica
   * @param assistencia
   */
  async confirmarAssistencia(
    assistencia: IAssistenciaModel[]
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return this.assistenciaService
      .confirmarAssistencia(assistencia, user)
      .toPromise();
  }
  /**
   * Confirmacio de l'assistencia per tecnica
   * @param esdeveniment Esdeveniment associat a la confirmació
   * @param assistencia llista de l'assitencia
   * @param loading Loading
   */
  async confirmacioTecnica(
    idEsdeveniment: string,
    assistencia: IAssistenciaModel[]
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.assistenciaService
      .confirmacioTecnica(idEsdeveniment, assistencia, user)
      .toPromise();
  }
  /**
   * Previsio de l'assistencia per tecnica
   * @param esdeveniment Esdeveniment associat a la confirmació
   * @param assistencia llista de l'assitencia
   * @param loading Loading
   */
  async previsioTecnica(
    idEsdeveniment: string,
    assistencia: IAssistenciaModel[]
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.assistenciaService
      .previsioTecnica(idEsdeveniment, assistencia, user)
      .toPromise();
  }
  /**
   * Metode per validar validar la confirmacio d'assistencia
   * @param est esdeveniment que es vol confirmar
   */
  async potConfirmarAssistencia(idTipus: string): Promise<boolean> {
    let user = await this.storeData.obtenirUsuari();
    if (
      this.usuariBs.esRolJunta(user) ||
      this.usuariBs.esRolSecretari(user) ||
      this.usuariBs.esRolConfirmadorAssistencia(user)
    )
      return true;
    if (this.usuariBs.esRolAdmin(user)) return true;
    if (
      this.usuariBs.esRolCapMusic(user) &&
      idTipus == Constants.ESDEVENIMENT_MUSICS
    )
      return true;
    if (
      this.usuariBs.esRolOrganitzador(user) &&
      (idTipus == Constants.ESDEVENIMENT_TALLER ||
        idTipus == Constants.ESDEVENIMENT_SOCIAL)
    )
      return true;
    return false;
  }
  /**
   * Metode per validar si pot visualitzar la llista completa d'assistencia
   * @param est esdeveniment que es vol confirmar
   */
  async potVisualitzarLlistaAssistenciaCompleta(
    idTipus: string
  ): Promise<boolean> {
    let user = await this.storeData.obtenirUsuari();
    if (
      this.usuariBs.esRolJunta(user) ||
      this.usuariBs.esRolSecretari(user) ||
      this.usuariBs.esRolConfirmadorAssistencia(user)
    )
      return true;
    if (this.usuariBs.esRolAdmin(user)) return true;
    if (
      (this.usuariBs.esRolTecnica(user) ||
        this.usuariBs.esRolTecnicaNivell2(user) ||
        this.usuariBs.esRolCamises(user)) &&
      (idTipus == Constants.ESDEVENIMENT_COMERCIAL ||
        idTipus == Constants.ESDEVENIMENT_ENTRENAMENT ||
        idTipus == Constants.ESDEVENIMENT_DIADA)
    )
      return true;
    if (
      this.usuariBs.esRolCapMusic(user) &&
      idTipus == Constants.ESDEVENIMENT_MUSICS
    )
      return true;
    if (
      this.usuariBs.esRolOrganitzador(user) &&
      (idTipus == Constants.ESDEVENIMENT_TALLER ||
        idTipus == Constants.ESDEVENIMENT_COMERCIAL ||
        idTipus == Constants.ESDEVENIMENT_SOCIAL)
    )
      return true;
    return false;
  }
}
