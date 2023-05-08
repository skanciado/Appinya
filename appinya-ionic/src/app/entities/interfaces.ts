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
export interface IRol {
  Id: string;
  Descripcio: string;
  Icon: string;
}
export interface IRespostaServidor {
  Correcte: boolean;
  Missatge: string;
}

export interface IRespostaServidorAmbRetorn<T> {
  Correcte: boolean;
  Missatge: string;
  Retorn: T;
}
export interface IResponsableLegalModel {
  IdCasteller: string;
  IdCastellerResponsable: string;
  Nom: string;
  TipusResponsableId: string;
  TipusResponsable: string;
  Cognoms: string;
  Telefon1: string;
  Telefon2: string;
  Email: string;
  EsCasteller: boolean;
}

export interface ITemporadaModel {
  Id: number;
  Descripcio: string;
  Puntuacio: number;
  DataInici: string;
  DataFi: string;
}

export interface IAssistenciaDetallForm {
  Delegacions: IAssistenciaModelList[];
  Adjunts: IAssistenciaModelList[];
  Assitiran: IAssistenciaModelList[];
  NoAssitiran: IAssistenciaModelList[];
  AssisteixenTronc: number;
  AssisteixenPinya: number;
  AssisteixenPinyaMix: number;
  AssisteixenCanalla: number;
  AssisteixenMusics: number;
  AssisteixenMusicsMix: number;
  AssisteixenSense: number;
  NoAssisteixenTronc: number;
  NoAssisteixenPinya: number;
  NoAssisteixenCanalla: number;
  NoAssisteixenMusics: number;
  NoAssisteixenSense: number;
  AssisteixenSanitaris: number;
  NoAssisteixenSanitaris: number;
  Acompanyants?: number;
  PrimerAssisteix?: IAssistenciaModelList;
  UltimAssisteix?: IAssistenciaModelList;
  Fantasma?: IAssistenciaModelList;
}
export interface IResumHomeModel {
  Esdeveniments?: IEsdevenimentResumModel[];
  Noticies?: INoticiaModel[];
}

export interface IControlDeVersio {
  EsUltimaVersio: boolean;
  RequereixRefresc: boolean;
  RequereixActualitzacio: boolean;
  Versio: number;
  Descripcio: String;
}
/*;
Clase de intercanvi de noticies i publicacions
*/
export interface IPaquetActualitzacio {
  DataActualitzacio: string;
  Temporada: ITemporadaModel;
  Noticies?: INoticiaModel[];
  Albums?: IAlbumsModel[];
  Esdeveniments?: IEsdevenimentResumModel[];
  Castellers: ICastellerModel[];
}
/**
 * Petició d'actualitzacio Id
 */
export interface PeticioActualitzacioId {
  Id: string;
  DataActualitzacio: string;
}

export interface IResultatPaquetActualitzacio {
  ActNoticies: number;
  ActEsdeveniments: number;
  ActCastellers: number;
  ActFotos: number;
}
export interface ITipusBasicsActualitzacio {
  DataActualitzacio: string;
  TipusPosicio: IEntitatHelper[];
  TipusNoticies: IEntitatHelper[];
  TipusEsdeveniments: IEntitatHelper[];
  TipusRelacio: IEntitatHelper[];
  TipusDocuments: IEntitatHelper[];
  TipusCastells: IEntitatHelper[];
  TipusProves: IEntitatHelper[];
  TipusEstatCastells: IEntitatHelper[];
}
export interface ICastellerDetallModel {
  UsuariInfo: IUsuariModel;
  EstadisticaIndividual: IEstadisticaIndividualModel[];
  Assistencia: IAssistenciaModel[];
  Deutes: IDeuteModel[];
}
export interface IDeuteModel {
  IdDeute: string;
  IdCasteller: string;
  Data: Date;
  Concepte: string;
  Valor: number;
  Pagat: boolean;
  DataPagament?: Date;
  Observacions: string;
  Creador: string;
  Modificador: string;
  DataCreador: Date;
  DataModificador: Date;
}

export interface ICastellerModel {
  Id: string;
  IdUsuari?: string;
  Nom: string;
  Cognom: string;
  Alias: string;
  Email: string;
  Telefon1: string;
  IdTipusDocument: string;
  TipusDocument: string;
  Document: string;
  VisTelefon1: boolean;
  Telefon2: string;
  VisTelefon2: boolean;
  Carrec: string;
  Direccio: string;
  CodiPostal: string;
  IdMunicipi?: string;
  IdProvincia?: string;
  Municipi?: string;
  Provincia?: string;
  VisDireccio: boolean;
  Assegurat: boolean;
  Edat: number;
  DataNaixement?: string;
  VisDataNaixement: boolean;
  TeCamisa: boolean;
  DataEntregaCamisa?: string;
  DataAlta?: string;
  DataBaixa?: string;
  EsBaixa: boolean;
  Foto?: string;
  Habitual: boolean;
  Actiu: boolean;
  DadesTecniques?: IDadesTecniquesModel;
  Sanitari: boolean;
  TeCasc: boolean;
  EsCascLloguer: boolean;
  Posicions?: IPosicioModel[];
  RebreCorreuFotos: boolean;
  RebreCorreuNoticies: boolean;
  ResponsablesLegals: IResponsableLegalModel[];
}
export interface IOrganitzacionModel {
  Id: string;
  Descripcio: string;
  Castellers: ICastellerModel[];
  SubOrganitzacio: IOrganitzacionModel[];
}

export interface IDadesTecniquesModel {
  Alcada?: number;
  Bracos?: number;
  Espatlla?: number;
  Pes?: number;
  Observacions: string;
}
export interface IEsdevenimentLogModel {
  IdLog: string;
  IdEsdeveniment: string;
  IdCasteller: string;
  Data: Date;
  Accio: number;
  IdCastellerCreador: string;
}
export interface IEsdevenimentLogFormModel {
  IdLog: string;
  IdEsdeveniment: string;
  Casteller: ICastellerModel;
  Data: Date;
  IdAccio: number;
  Accio: string;
  CastellerCreador: ICastellerModel;
}

export interface IEsdevenimentCastellModel {
  Id: number;
  IdEsdeveniment: string;
  IdEstatCastell: string;
  IdTipusCastell: string;
  Prova: boolean;
  Data: Date;
  Ordre: number;
  Xarxa: boolean;
  Observacions: String;
}
export interface IEsdevenimentValoracioModel {
  IdCasteller: string;
  IdEsdeveniment: string;
  Data: string;
  Valoracio: number;
}
export interface IAssistenciaCastellerModel {
  Assistencia: IAssistenciaModel;
  Esdeveniment: IEsdevenimentModel;
  Estrelles: number;
  Temps: String;
}
export interface IAssistenciaModelList extends IAssistenciaModel {
  Foto?: string;
  Nom: string;
  Cognoms: string;
  Alias: string;
}

export interface IAssistenciaModel {
  Casteller: string;
  Esdeveniment: string;
  Assistire?: boolean;
  ConfirmacioTecnica: boolean;
  Observacions?: string;
  NumAcompanyants?: number;
  Transport?: boolean;
  TransportAnada?: boolean;
  TransportTornada?: boolean;
  Preguntes: IPreguntaModel[];
  DataModificacio: Date;
}
/**
 * Petició d'actualitzacio Id
 */
export interface IPreguntaModel {
  IdPregunta: string;
  Pregunta: string;
  TipusPregunta: string;
  Valores: string[];
  Resposta: string;
  ComboRespuesta: string[]; // Camp Calculat
}

export interface IEsdevenimentModelList {
  Id: string;
  Titol: string;
  Descripcio: string;
  Icona: string;
  TipusEsdeveniment: string;
  DataIni: string;
  DataFi: string;
  OfereixTransport: boolean;
  Anulat: boolean;
  Bloquejat: boolean;
  Assistencia?: number;
  NoAssistencia?: number;
  Confirmats?: number;
  Direccio?: string;
  Actiu: boolean;
  Temporada: number;
  Assistire?: boolean;
}

export interface IEsdevenimentModel {
  Id: string;
  Titol: string;
  Descripcio: string;
  TipusEsdeveniment: string;
  DataIni: string;
  DataFi: string;
  Latitud?: number;
  Longitud?: number;
  Responsable?: string;
  Confirmat: boolean;
  OfereixTransport: boolean;
  Anulat: boolean;
  Bloquejat: boolean;
  Assistencia?: number;
  NoAssistencia?: number;
  Confirmats?: number;
  Direccio?: string;
  Actiu: boolean;
  Temporada: number;
  TransportTornada: boolean;
  TransportAnada: boolean;
  Preguntes: IPreguntaModel[];
  Assistire?: boolean;
  DataActualitzacio: string;
}
export interface IEsdevenimentDetallFormModel extends IEsdevenimentDetallModel {
  Referenciats: IAssistenciaModel[];
  Delegats: IAssistenciaModel[];
  BloquejarAssistencia: boolean;
  TipusEsdeveniment: string;
  DataDescarrega: string;
}

export interface IEsdevenimentDetallModel extends IEsdevenimentModel {
  Assistencia?: number;
  NoAssistencia?: number;
  Assistire?: boolean;
  CastellersAssitiran?: IAssistenciaModel[];
  CastellersNoAssitiran?: IAssistenciaModel[];
  AssistenciaPersonal?: IAssistenciaModel;
  ValoracioPersonal?: IEsdevenimentValoracioModel;
  EsdevenimentLog?: IEsdevenimentLogModel[];
  Castells: IEsdevenimentCastellModel[];
}
export interface IEsdevenimentResumModel extends IEsdevenimentModel {
  Assistencia?: number;
  NoAssistencia?: number;
  Assistire?: boolean;
}
export interface INoticiaModel {
  Id: string;
  Titol: string;
  Descripcio: string;
  IdTipusNoticia: any;
  Indefinida: boolean;
  Data?: string;
  Url: string;
  UsuariReferencia?: ICastellerModel;
  Activa: boolean;
  Foto?: String;
}
export interface IAlbumsModel {
  Id: string;
  Album: string;
  Descripcio: string;
  Data: string;
  Url: string;
  Fotograf?: ICastellerModel;
  Activa: boolean;
  Portada?: String;
  Likes?: number /* de treball */;
  JoLike?: boolean /* de treball */;
  estat?: string /* de treball */;
}
export interface ILikesHelper {
  IdAlbum: string;
  Likes: number;
  JoLike: boolean;
}
export interface IEntitatHelper {
  Id: string;
  Descripcio: string;
  Icona: string;
}
export interface IConfirmacioAssistenciaModel {
  Assistencia: IAssistenciaModel;
  Assistira: boolean;
  Salvat: boolean;
  ConfirmacioTecnica: boolean;
}

export interface IPosicioModel {
  IdPosicio: string;
  Descripcio: string;
  Experiencia?: number;
}

export interface IEstadisticaIndividualModel {
  Id: number;
  IdTipus: number;
  Dia: number;
  Mes: number;
  Anys: number;
  Assitire: boolean;
  Confirmacio: boolean;
  IdCasteller: number;
  IdEsdeveniment: String;
  idTemporada: String;
}

export interface IUsuariSessio {
  Id: string;
  Usuari: string;
  Nom: string;
  Cognom: string;
  Email: string;
  Contrasenya: string;
  Rols: string[];
  ConfirmatEmail: Boolean;
  Token: string;
  RefreshToken: string;
}
export interface IUsuariModel {
  Id: string;
  Usuari: string;
  Nom: string;
  Cognom: string;
  Email: string;
  ConfirmatEmail: Boolean;
  Telefon: string;
  Rols: string[];
  CastellerId: string;

  Delegats: string[];
  Delegacions: string[];

  Adjunts: string[];
  Referents: string[];

  SolicitutsEnviades: string[];
  SolicitutsRebudes: string[];
  RebreEmailNoticies: Boolean;
  RebreEmailFotos: Boolean;
}
export interface IUsuariInfo extends IUsuariModel {
  Foto: string; // Propietat calculada
}
