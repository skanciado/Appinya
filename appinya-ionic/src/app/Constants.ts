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
export class Constants {
  /* Variables del Llistat Paginat */
  static ESTAT_LLISTAT_CARREGANT: number = 1;
  static ESTAT_LLISTAT_CARREGAT: number = 3;
  static ESTAT_LLISTAT_ERROR_CONEXIO: number = 4;
  static ESTAT_LLISTAT_SENSE_RESULTATS: number = 5;

  /* Variables de tipus noticies */
  static NOTICIES_BAR: number = 6;
  static NOTICIES_ENTRENAMENT: number = 4;
  static NOTICIES_SOCIAL: number = 5;

  /* Variables de tipus de entrenamnets */
  static ESDEVENIMENT_DIADA: string = "1";
  static ESDEVENIMENT_ENTRENAMENT: string = "2";
  static ESDEVENIMENT_COMERCIAL: string = "3";
  static ESDEVENIMENT_TALLER: string = "4";
  static ESDEVENIMENT_SOCIAL: string = "5";
  static ESDEVENIMENT_MUSICS: string = "6";
  static ESDEVENIMENT_ENTRENAMENT_OPC: string = "7";

  /* Variables de tipus de entrenamnets */
  static ESDEVENIMENT_DIADA_ICON: string = "icon-ico_camisa";
  static ESDEVENIMENT_ENTRENAMENT_ICON: string = "icon-ico_pesa";
  static ESDEVENIMENT_COMERCIAL_ICON: string = "icon-ico_camisa_comercial";
  static ESDEVENIMENT_TALLER_ICON: string = "icon-ico_caballs";
  static ESDEVENIMENT_SOCIAL_ICON: string = "icon-ico_cohet";
  static ESDEVENIMENT_MUSICS_ICON: string = "icon-ico_musics";
  static ESDEVENIMENT_ENTRENAMENT_OPC_ICON: string = "icon-ico_pesa";

  /* Dies de la setmana */
  static DIES_SETMANA: string[] = [
    "Dilluns",
    "Dimarts",
    "Dimecres",
    "Dijous",
    "Divendres",
    "Dissabte",
    "Diumenge",
  ];
  static MESOS_ANY: string[] = [
    "Gener",
    "Febrer",
    "Març",
    "Abril",
    "Maig",
    "Juny",
    "Juliol",
    "Agost",
    "Setembre",
    "Octubre",
    "Novembre",
    "Desembre",
  ];
  static es_ES = {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
    monthNamesShort: [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ],
    today: "Hoy",
    clear: "Borrar",
  };
  /* Errors definints */
  static ERROR_MSG_SENSE_CONEXIO: string = "Error en la conexió";

  static ERROR_MSG_NOT_URL_OBLIGATORI: string =
    "S'ha d'introduir una URL externa";
  static ERROR_MSG_FOT_PORTADA_OBLIGATORI: string = "La portada és obligatori";
  static ERROR_MSG_FOT_FOTOGRAF_OBLIGATORI: string =
    "La fotògraf és obligatori";
  static ERROR_MSG_FOT_URL_OBLIGATORI: string =
    "El link al album és obligatori";
  static ERROR_MSG_CAS_NOM_OBLIGATORI: string = "El nom és obligatori";
  static ERROR_MSG_CAS_DATA_NAIX_OBLIGATORI: string =
    "La data de naixement és obligatòria";
  static ERROR_MSG_CAS_COGNOM_OBLIGATORI: string = "El cognom és obligatori";
  static ERROR_MSG_CAS_TIPUS_DOC_OBLIGATORI: string =
    "El tipus de document és obligatori";
  static ERROR_MSG_CAS_DOC_OBLIGATORI: string = "El document és obligatori";
  static ERROR_MSG_CAS_DIRECCIO_OBLIGATORI: string =
    "La direcció és obligatòria";
  static ERROR_MSG_CAS_CP_OBLIGATORI: string = "El codi postal és obligatori";
  static ERROR_MSG_CAS_TEL_OBLIGATORI: string = "El telèfon és obligatori";
}
