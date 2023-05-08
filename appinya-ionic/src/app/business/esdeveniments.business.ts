/**
 *  Appinya Open Source Project
 *  Copyright (C) 2023  Daniel Horta Vidal
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
import { lastValueFrom } from 'rxjs';
import { Injectable } from "@angular/core";
import { Constants } from "../Constants";
import {
  IEsdevenimentModel,
  IAssistenciaDetallForm,
  ICastellerModel,
  IAssistenciaModel,
  IAssistenciaModelList,
  IEntitatHelper,
  IPosicioModel,
  IRespostaServidor,
  IEsdevenimentResumModel,
  IEsdevenimentModelList,
  IEsdevenimentDetallModel,
  IEsdevenimentDetallFormModel,
  IEsdevenimentCastellModel,
  IRespostaServidorAmbRetorn,
} from "../entities/interfaces";

import { Diccionari } from "../entities/Diccionari";
import { AssistenciaService } from "../services/assistencia.service";
import { EsdevenimentService } from "../services/esdeveniments.service";
import { CastellersBs } from "./casteller.business";
import { StoreData } from "../services/storage.data";
import { UsuariBs } from "./Usuari.business";
import { DeviceService } from "../services/device.service";
import { ErrorSenseInternet } from "../entities/Errors";

@Injectable({
  providedIn: "root",
})
export class EsdevenimentBs {
  constructor(
    protected assistenciaService: AssistenciaService,
    protected esdevenimentService: EsdevenimentService,
    protected usuariBs: UsuariBs,
    protected castellersBs: CastellersBs,
    protected storeData: StoreData,
    protected deviceService: DeviceService
  ) { }

  public async actualitzarEsdevenimentsActuals() {
    await this.storeData.carregarLocalInformacioPublica();
  }
  /**
   * Retorna els esdeveniments actuals (no passats)
   */
  public async obtenirEsdevenimentsActuals(
    text?: string,
    tipus?: IEntitatHelper[]
  ): Promise<IEsdevenimentModel[]> {
    tipus = tipus || [];
    return (await this.storeData.obtenirEsdevenimentsActuals()).filter(
      (esdev) => {
        if (
          text &&
          esdev.Descripcio.toLowerCase().indexOf(text.toLowerCase()) <= -1 &&
          esdev.Titol.toLowerCase().indexOf(text.toLowerCase()) <= -1
        ) {
          return false;
        }
        if (!tipus || tipus.length == 0) return true;
        for (var z = 0; z < tipus.length; z++) {
          if (tipus[z].Id == esdev.TipusEsdeveniment) {
            return true;
          }
        }
        return false;
      }
    );

  }
  /**
   * 
   * @param text Obtenir esdeveniments amb paginació
   * @param tipus 
   * @param regIni 
   * @returns 
   */
  public async obtenirEsdevenimentsActualsPaginats(
    text?: string,
    tipus?: IEntitatHelper[],
    regIni: number = 0
  ): Promise<IEsdevenimentModel[]> {
    tipus = tipus || [];
    let res: IEsdevenimentModel[] = (await this.storeData.obtenirEsdevenimentsActuals()).filter(
      (esdev) => {
        if (
          text &&
          esdev.Descripcio.toLowerCase().indexOf(text.toLowerCase()) <= -1 &&
          esdev.Titol.toLowerCase().indexOf(text.toLowerCase()) <= -1
        ) {
          return false;
        }
        if (!tipus || tipus.length == 0) return true;
        for (var z = 0; z < tipus.length; z++) {
          if (tipus[z].Id == esdev.TipusEsdeveniment) {
            return true;
          }
        }
        return false;
      }

    );

    let pagina: IEsdevenimentModel[] = [];
    for (var i = regIni; i < res.length; i++) {
      pagina.push(res[i]);
      if (pagina.length >= Constants.PAGINACIO) return pagina;
    }
    return pagina;
  }
  /**
   * Retorna els esdeveniments actuals (no passats)
   */

  public obtenirIconTipusEsdeveniments(
    esdeveniment: IEsdevenimentModel
  ): string {
    if (esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_SOCIAL)
      return "icon-ico_cohet";
    else if (esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_DIADA)
      return Constants.ESDEVENIMENT_DIADA_ICON;
    else if (
      esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_ENTRENAMENT_OPC
    )
      return Constants.ESDEVENIMENT_ENTRENAMENT_ICON;
    else if (esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_TALLER)
      return Constants.ESDEVENIMENT_TALLER_ICON;
    else if (
      esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_ENTRENAMENT
    )
      return Constants.ESDEVENIMENT_ENTRENAMENT_ICON;
    else if (esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_COMERCIAL)
      return Constants.ESDEVENIMENT_COMERCIAL_ICON;
    else if (esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_MUSICS)
      return Constants.ESDEVENIMENT_MUSICS_ICON;
    else return "";
  }
  /**
   * Copia un esdeveniment però deixant-lo actiu a una altre esdeveniment
   * @param esdeveniment
   */
  public async clonarEsdeveniment(
    idEsdeveniment: string
  ): Promise<IEsdevenimentModel | undefined> {
    let esdevenimentWrk: IEsdevenimentModel | undefined = await this.obtenirEsdeveniment(
      idEsdeveniment
    );
    if (esdevenimentWrk)
      return {
        Id: "0",
        DataIni: esdevenimentWrk.DataIni,
        DataFi: esdevenimentWrk.DataFi,
        Descripcio: esdevenimentWrk.Descripcio,
        Titol: esdevenimentWrk.Titol,
        TipusEsdeveniment: esdevenimentWrk.TipusEsdeveniment,
        Latitud: esdevenimentWrk.Latitud,
        Longitud: esdevenimentWrk.Longitud,
        OfereixTransport: esdevenimentWrk.OfereixTransport,
        Anulat: false,
        Responsable: esdevenimentWrk.Responsable,
        Bloquejat: false,
        Direccio: esdevenimentWrk.Direccio,
        Confirmat: false,
        Actiu: true,
        Assistencia: 0,
        Confirmats: 0,
        NoAssistencia: 0,
        Preguntes: [],
        Temporada: 0,
        TransportAnada: false,
        TransportTornada: false,
        Assistire: false,
        DataActualitzacio: "",
      };
    else {
      return undefined;
    }
  }

  /**
   * Validar si es pot editar un esdeveniment
   * @param esdeveniment Esdeveniment que es vol editar , si es null es considera que es vol crear un esdeveniment
   */
  public async potEditar(esdeveniment: IEsdevenimentModel): Promise<boolean> {
    let user = await this.storeData.obtenirUsuari();
    if (
      this.usuariBs.esRolAdmin(user) ||
      this.usuariBs.esRolSecretari(user) ||
      this.usuariBs.esRolCapMusic(user) ||
      this.usuariBs.esRolOrganitzador(user) ||
      this.usuariBs.esRolJunta(user)
    ) {
      return true;
    } else if (!esdeveniment) {
      return false;
    } else {
      return (
        this.usuariBs.esRolJunta(user) ||
        this.usuariBs.esRolSecretari(user) ||
        ((esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_SOCIAL ||
          esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_TALLER ||
          esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_COMERCIAL) &&
          this.usuariBs.esRolOrganitzador(user)) ||
        (esdeveniment.TipusEsdeveniment == Constants.ESDEVENIMENT_MUSICS &&
          this.usuariBs.esRolCapMusic(user))
      );
    }
  }

  /**
   * Retorna els tipus d'esdeveniments disponibles per l'usuari
   */
  public async obtenirTipusEsdeveniments(): Promise<IEntitatHelper[]> {
    let user = await this.storeData.obtenirUsuari();
    return (await this.storeData.obtenirTipusEsdeveniments()).filter(
      (esdeveniment) => {
        if (
          this.usuariBs.esRolAdmin(user) ||
          this.usuariBs.esRolSecretari(user) ||
          this.usuariBs.esRolCapMusic(user) ||
          this.usuariBs.esRolOrganitzador(user) ||
          this.usuariBs.esRolJunta(user)
        ) {
          return true;
        } else if (!esdeveniment) {
          return false;
        } else {
          return (
            this.usuariBs.esRolJunta(user) ||
            this.usuariBs.esRolSecretari(user) ||
            ((esdeveniment.Id == Constants.ESDEVENIMENT_SOCIAL ||
              esdeveniment.Id == Constants.ESDEVENIMENT_TALLER ||
              esdeveniment.Id == Constants.ESDEVENIMENT_COMERCIAL) &&
              this.usuariBs.esRolOrganitzador(user)) ||
            (esdeveniment.Id == Constants.ESDEVENIMENT_MUSICS &&
              this.usuariBs.esRolCapMusic(user))
          );
        }
      }
    );
  }
  /**
   * Separa l'assistencia dels referents i delegats d'un esdeveniment
   * @param esdeveniment Esdeveniment que vols saver l'assistencia
   */
  public async carregarAssitenciaAEsdevenimentFormulari(
    esdeveniment: IEsdevenimentDetallModel,
    esdevenimentDetall: IAssistenciaDetallForm
  ): Promise<IAssistenciaDetallForm> {
    //resolve(true);

    if (esdeveniment.CastellersAssitiran)
      esdeveniment.CastellersAssitiran.forEach(async (ass) => {
        // Si estem ens carregem la assistencia meva
        let cas: ICastellerModel = await this.castellersBs.obtenirCasteller(
          ass.Casteller
        );
        if (cas == null) return;
        let troncsAdd: boolean = false;
        let CanallaAdd: boolean = false;
        let PinyaAdd: boolean = false;
        let MusicsAdd: boolean = false;

        let assDet: IAssistenciaModelList = {
          Alias: cas.Alias,
          Assistire: ass.Assistire,
          Foto: cas.Foto,
          Cognoms: cas.Cognom,
          ConfirmacioTecnica: ass.ConfirmacioTecnica,
          Nom: cas.Nom,
          Casteller: cas.Id,
          Esdeveniment: esdeveniment.Id,
          DataModificacio: ass.DataModificacio,
          NumAcompanyants: ass.NumAcompanyants,
          Observacions: ass.Observacions,
          Transport: ass.Transport,
          Preguntes: ass.Preguntes,
          TransportAnada: false,
          TransportTornada: false,
        };
        if (cas.Sanitari) {
          if (ass.Assistire) esdevenimentDetall.AssisteixenSanitaris++;
          else esdevenimentDetall.NoAssisteixenSanitaris++;
        }
        esdevenimentDetall.Acompanyants = ass.NumAcompanyants;
        esdevenimentDetall.Assitiran.push(assDet);
        let pos: Number = -1;
        let exp: Number = 0;

        if (!cas.Posicions || cas.Posicions.length == 0)
          esdevenimentDetall.AssisteixenSense++;
        else {
          cas.Posicions.forEach((it) => {
            pos = Number(it.IdPosicio);
            if (pos < 30) {
              if (!CanallaAdd) CanallaAdd = true;
            } else if (pos < 100) {
              if (!PinyaAdd) PinyaAdd = true;
            } else if (pos < 200) {
              if (!troncsAdd) troncsAdd = true;
            } else if (pos < 500) {
              if (!MusicsAdd) MusicsAdd = true;
            }
          });

          if (MusicsAdd) {
            if (CanallaAdd) {
              esdevenimentDetall.AssisteixenCanalla++;
              esdevenimentDetall.AssisteixenMusicsMix++;
            } else if (PinyaAdd) {
              esdevenimentDetall.AssisteixenPinya++;
              esdevenimentDetall.AssisteixenMusicsMix++;
            } else if (troncsAdd) {
              esdevenimentDetall.AssisteixenTronc++;
              esdevenimentDetall.AssisteixenMusicsMix++;
            } else esdevenimentDetall.AssisteixenMusics++;
          } else if (PinyaAdd) {
            if (CanallaAdd) {
              esdevenimentDetall.AssisteixenCanalla++;
              esdevenimentDetall.AssisteixenPinyaMix++;
            } else if (troncsAdd) {
              esdevenimentDetall.AssisteixenTronc++;
              esdevenimentDetall.AssisteixenPinyaMix++;
            } else esdevenimentDetall.AssisteixenPinya++;
          } else if (CanallaAdd) {
            esdevenimentDetall.AssisteixenCanalla++;
          } else if (troncsAdd) {
            esdevenimentDetall.AssisteixenTronc++;
          }
        }

        if (
          !esdevenimentDetall.PrimerAssisteix ||
          (esdevenimentDetall.PrimerAssisteix.DataModificacio &&
            esdevenimentDetall.PrimerAssisteix.DataModificacio.getTime() >
            assDet.DataModificacio.getTime())
        )
          esdevenimentDetall.PrimerAssisteix = assDet;
        if (
          !esdevenimentDetall.UltimAssisteix ||
          (esdevenimentDetall.UltimAssisteix.DataModificacio &&
            esdevenimentDetall.UltimAssisteix.DataModificacio.getTime() <
            assDet.DataModificacio.getTime())
        )
          esdevenimentDetall.UltimAssisteix = assDet;
        if (assDet.ConfirmacioTecnica && !assDet.Assistire == false)
          esdevenimentDetall.Fantasma = assDet;
      });
    // Carrega de NO assitencia Teva/ delegats i minions
    if (esdeveniment.CastellersNoAssitiran)
      esdeveniment.CastellersNoAssitiran.forEach(async (ass) => {
        // Si estem ens carregem la assistencia
        let cas: ICastellerModel = await this.castellersBs.obtenirCasteller(
          ass.Casteller
        );

        let troncsAdd: boolean = false;
        let CanallaAdd: boolean = false;
        let PinyaAdd: boolean = false;
        let MusicsAdd: boolean = false;

        let assDet: IAssistenciaModelList = {
          Alias: cas.Alias,
          Assistire: ass.Assistire,
          Foto: cas.Foto,
          Casteller: cas.Id,
          Cognoms: cas.Cognom,
          ConfirmacioTecnica: ass.ConfirmacioTecnica,
          Nom: cas.Nom,
          Esdeveniment: esdeveniment.Id,
          DataModificacio: ass.DataModificacio,
          NumAcompanyants: ass.NumAcompanyants,
          Observacions: ass.Observacions,
          Transport: ass.Transport,
          Preguntes: ass.Preguntes,
          TransportAnada: false,
          TransportTornada: false,
        };

        esdevenimentDetall.NoAssitiran.push(assDet);

        let pos: Number = -1;
        let exp: Number = 0;
        if (!cas.Posicions || cas.Posicions.length == 0) {
          esdevenimentDetall.NoAssisteixenSense++;
        } else {
          cas.Posicions.forEach((it) => {
            pos = Number(it.IdPosicio);
            if (pos < 30) {
              if (!CanallaAdd) esdevenimentDetall.NoAssisteixenCanalla++;
              CanallaAdd = true;
            } else if (pos < 100) {
              if (!PinyaAdd) esdevenimentDetall.NoAssisteixenPinya++;
              PinyaAdd = true;
            } else if (pos < 200) {
              if (!troncsAdd) esdevenimentDetall.NoAssisteixenTronc++;
              troncsAdd = true;
            } else if (pos < 500) {
              if (!MusicsAdd) esdevenimentDetall.NoAssisteixenMusics++;
              MusicsAdd = true;
            }
          });
        }
        if (assDet.ConfirmacioTecnica && !assDet.Assistire) {
          esdevenimentDetall.Fantasma = assDet;
        }
      });

    let usuari = await this.storeData.obtenirUsuari();

    if (usuari.Delegats)
      usuari.Delegacions.forEach(async (d) => {
        let cas: ICastellerModel = await this.castellersBs.obtenirCasteller(
          String(d)
        );
        esdevenimentDetall.Delegacions.push({
          Casteller: cas.Id,
          Foto: cas.Foto,
          Nom: cas.Nom,
          Cognoms: cas.Cognom,
          Alias: cas.Alias,
          Preguntes: esdeveniment.Preguntes,
          TransportAnada: false,
          TransportTornada: false,
          ConfirmacioTecnica: false,
          Transport: false,
          Observacions: "",
          NumAcompanyants: 0,
          DataModificacio: new Date(),
          Esdeveniment: esdeveniment.Id,
        });
      });
    // Pre cargar de els Minions
    if (usuari.Adjunts)
      usuari.Adjunts.forEach(async (d) => {
        let cas: ICastellerModel = await this.castellersBs.obtenirCasteller(
          String(d)
        );
        esdevenimentDetall.Adjunts.push({
          Casteller: cas.Id,
          Foto: cas.Foto,
          Nom: cas.Nom,
          Cognoms: cas.Cognom,
          Alias: cas.Alias,
          Preguntes: esdeveniment.Preguntes,
          TransportAnada: false,
          TransportTornada: false,
          ConfirmacioTecnica: false,
          Transport: false,
          Observacions: "",
          NumAcompanyants: 0,
          DataModificacio: new Date(),
          Esdeveniment: esdeveniment.Id,
        });
      });

    // Carrega de assitencia Teva/ delegats i minions

    if (esdeveniment.CastellersAssitiran)
      esdeveniment.CastellersAssitiran.forEach(async (ass) => {
        let cas: ICastellerModel = await this.castellersBs.obtenirCasteller(
          ass.Casteller
        );

        // Cerquem els nostres delegats
        esdevenimentDetall.Delegacions.forEach((delegat) => {
          if (delegat.Casteller == ass.Casteller) {
            delegat.Assistire = true;
            delegat.Transport = ass.Transport;
            delegat.TransportAnada = ass.TransportAnada
              ? ass.TransportAnada
              : false;
            delegat.TransportTornada = ass.TransportTornada
              ? ass.TransportTornada
              : false;
            delegat.NumAcompanyants = ass.NumAcompanyants;
            (delegat.Preguntes = ass.Preguntes),
              (delegat.Observacions = ass.Observacions);
            delegat.ConfirmacioTecnica = ass.ConfirmacioTecnica;
          }
        });
        //Cerquem els nostres minions
        esdevenimentDetall.Adjunts.forEach((adjunt) => {
          if (adjunt.Casteller == ass.Casteller) {
            adjunt.Assistire = true;
            adjunt.Transport = ass.Transport;
            adjunt.TransportAnada = ass.TransportAnada
              ? ass.TransportAnada
              : false;
            adjunt.TransportTornada = ass.TransportTornada
              ? ass.TransportTornada
              : false;
            adjunt.NumAcompanyants = ass.NumAcompanyants;
            (adjunt.Preguntes = ass.Preguntes),
              (adjunt.Observacions = ass.Observacions);
            adjunt.ConfirmacioTecnica = ass.ConfirmacioTecnica;
          }
        });
      });
    // Carrega de NO assitencia Teva/ delegats i minions
    if (esdeveniment.CastellersNoAssitiran)
      esdeveniment.CastellersNoAssitiran.forEach((ass) => {
        // noAssitiran.push(this.storeData.getCasteller(ass.Casteller));
        // Cerquem els nostres delegats
        esdevenimentDetall.Delegacions.forEach((delegat) => {
          if (delegat.Casteller == ass.Casteller) {
            delegat.Assistire = false;
            delegat.ConfirmacioTecnica = ass.ConfirmacioTecnica;
          }
        });
        //Cerquem els nostres minions
        esdevenimentDetall.Adjunts.forEach((adjunt) => {
          if (adjunt.Casteller == ass.Casteller) {
            adjunt.Assistire = false;
            adjunt.ConfirmacioTecnica = ass.ConfirmacioTecnica;
          }
        });
      });
    return esdevenimentDetall;
  }
  /**
   * OBenir els castellers habituals que estan sense dir res
   * @param esdeveniment l'esdeveniment que vols consultar
   * @param text filtre de text per cercar castellers
   * @param posicionsFiltre posicions que vols filtrar
   */
  public async obtenirCastellersPdtConfirmar(
    esdeveniment: IEsdevenimentDetallModel,
    text: string,
    posicionsFiltre: string[]
  ): Promise<ICastellerModel[]> {
    return (await this.storeData.obtenirCastellers()).filter((cas) => {
      if (!cas.Actiu || cas.EsBaixa || !cas.Habitual) return false;

      let nom: String = cas.Nom.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let cognom: String = cas.Cognom.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let alias: String = cas.Alias.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let nomComplet: string = nom.toLowerCase() + " " + cognom.toLowerCase();
      let queryNormal: String = text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      let textFind: boolean = false;
      if (!text) textFind = true;
      else if (nom.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
        textFind = true;
      else if (cognom.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
        textFind = true;
      else if (alias.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
        textFind = true;
      else if (nomComplet.indexOf(queryNormal.toLowerCase()) > -1)
        textFind = true;

      if (!textFind) return false;

      if (posicionsFiltre && posicionsFiltre.length > 0) {
        if (cas && cas.Posicions) {
          var indexWrk: number = cas.Posicions.findIndex((t) => {
            var index: number = posicionsFiltre.findIndex((d) => {
              if (d == t.IdPosicio) return true;
              else return false;
            });
            if (index >= 0) return true;
            else return false;
          });
          if (indexWrk < 0) return false;
        } else return false;
      }

      let obj: IAssistenciaModel | undefined = esdeveniment.CastellersAssitiran?.find(
        (ass) => {
          if (ass.Casteller == cas.Id) return true;
          return false;
        }
      );
      if (obj) return false;
      obj = esdeveniment.CastellersNoAssitiran?.find((ass) => {
        if (ass.Casteller == cas.Id) return true;
        return false;
      });
      if (obj) return false;

      return true;
    });
  }

  /**
   * Retorna els castellers que assistiran a un esdeveniment
   * @param esdeveniment Esdeveniment objecte de la cerca
   * @param text text de cerca per castellers
   * @param posicionsFiltre filtre de posicions del casteller
   */
  public async obtenirCastellersAssistencia(
    list: IAssistenciaModel[],
    text: string,
    posicionsFiltre: string[]
  ): Promise<{ casteller: ICastellerModel; assistencia: IAssistenciaModel }[]> {
    let lstCas: {
      casteller: ICastellerModel;
      assistencia: IAssistenciaModel;
    }[] = [];
    for (var ass of list) {
      let cas: ICastellerModel = await this.castellersBs.obtenirCasteller(
        ass.Casteller
      );
      let nom: String = cas.Nom.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let cognom: String = cas.Cognom.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let alias: String = cas.Alias.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let nomComplet: string = nom.toLowerCase() + " " + cognom.toLowerCase();
      let skipPosition: boolean = false;
      if (posicionsFiltre && posicionsFiltre.length > 0) {
        if (cas && cas.Posicions) {
          var indexWrk: number = cas.Posicions.findIndex((t) => {
            // Encontramos la posicion en el filtro
            var index: number = posicionsFiltre.findIndex((d) => {
              if (d == t.IdPosicio) return true;
              else return false;
            });
            //Si encontramos la posicion el el filtro OK
            if (index >= 0) return true;
            else return false;
          });
          if (indexWrk < 0) skipPosition = true;
        } else skipPosition = true;
      }
      if (skipPosition == false && text) {
        let queryNormal: String = text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (nom.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
          lstCas.push({ assistencia: ass, casteller: cas });
        else if (cognom.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
          lstCas.push({ assistencia: ass, casteller: cas });
        else if (alias.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
          lstCas.push({ assistencia: ass, casteller: cas });
        else if (nomComplet.indexOf(queryNormal.toLowerCase()) > -1)
          lstCas.push({ assistencia: ass, casteller: cas });
      } else {
        lstCas.push({ assistencia: ass, casteller: cas });
      }
    }

    return lstCas;
  }
  /**
   *
   * @param esdeveniment Actaulitzar Esdeveniment Model de la vita
   * @param loading
   */
  public async obtenirEsdevenimentDetallModelStored(
    idEsdeveniment: string
  ): Promise<IEsdevenimentDetallFormModel | null> {
    let online = await this.storeData.esOnline();
    let esdevenimentDetall: IEsdevenimentDetallFormModel | null = null;

    if (!online) {
      // No online
      // Busquem en el store
      esdevenimentDetall = await this.storeData.obtenirEsdevenimentDetall(
        idEsdeveniment
      );
    }
    return esdevenimentDetall;

  }
  /**
   * Actualitzar Esdeveniment amb el servidor
   * @param idEsdeveniment ç
   */
  public async obtenirEsdevenimentDetallModel(
    idEsdeveniment: string
  ): Promise<IEsdevenimentDetallFormModel> {
    let esdevenimentDetall: IEsdevenimentDetallFormModel;
    let usuari = await this.storeData.obtenirUsuari();
    let user = await this.storeData.obtenirUsuariSession();
    if (this.deviceService.esConexioActiva()) {
      esdevenimentDetall = (await this.esdevenimentService
        .obtenirDetallEsdeveniments(idEsdeveniment, user)
        .toPromise()) as IEsdevenimentDetallFormModel;

      esdevenimentDetall.DataDescarrega = new Date().toISOString();
      esdevenimentDetall.BloquejarAssistencia =
        esdevenimentDetall.Anulat || esdevenimentDetall.Bloquejat;
      // si no ens arriba la assistencia personal la inicialitzem
      if (esdevenimentDetall.AssistenciaPersonal == null) {
        esdevenimentDetall.AssistenciaPersonal = {
          Casteller: usuari.CastellerId,
          Preguntes: JSON.parse(JSON.stringify(esdevenimentDetall.Preguntes)),
          TransportAnada: false,
          TransportTornada: false,
          ConfirmacioTecnica: false,
          Transport: false,
          Observacions: "",
          NumAcompanyants: 0,
          DataModificacio: new Date(),
          Esdeveniment: idEsdeveniment,
        };
      } else {
        // validem les preguntes s'han agregat noves
        esdevenimentDetall.Preguntes.forEach((p1) => {
          let find = false;
          esdevenimentDetall?.AssistenciaPersonal?.Preguntes.forEach((p2) => {
            if (p1.IdPregunta == p2.IdPregunta) {
              find = true;
            }
          });
          if (!find) {
            esdevenimentDetall?.AssistenciaPersonal?.Preguntes.push(
              JSON.parse(JSON.stringify(p1))
            );
          }
        });
      }
      // Tipus esdeveniment
      this.storeData.obtenirTipusEsdeveniments().then((tipus) => {
        esdevenimentDetall.TipusEsdeveniment = tipus.find((t) => {
          return t.Id == esdevenimentDetall.TipusEsdeveniment;
        })?.Descripcio ?? "";
      });

      /*
      Carrega per Referenciats (Minions)
       */
      esdevenimentDetall.Referenciats = [];
      usuari.Adjunts.forEach((cas) => {
        let ass1 = esdevenimentDetall?.CastellersAssitiran?.find((ass) => {
          return ass.Casteller == cas;
        });
        if (ass1) {
          esdevenimentDetall.Preguntes.forEach((p1) => {
            let find = false;
            ass1?.Preguntes.forEach((p2) => {
              if (p1.IdPregunta == p2.IdPregunta) {
                find = true;
              }
            });
            if (!find) {
              ass1?.Preguntes.push(JSON.parse(JSON.stringify(p1)));
            }
          });
          esdevenimentDetall.Referenciats.push(ass1);
        } else {
          let noass = esdevenimentDetall?.CastellersNoAssitiran?.find((ass) => {
            return ass.Casteller == cas;
          });
          if (noass) {
            // validem les preguntes s'han agregat noves
            esdevenimentDetall.Preguntes.forEach((p1) => {
              let find = false;
              noass?.Preguntes.forEach((p2) => {
                if (p1.IdPregunta == p2.IdPregunta) {
                  find = true;
                }
              });
              if (!find) {
                noass?.Preguntes.push(JSON.parse(JSON.stringify(p1)));
              }
            });
            esdevenimentDetall.Referenciats.push(noass);
          } else {
            esdevenimentDetall.Referenciats.push(<IAssistenciaModel>{
              Casteller: cas,
              Preguntes: JSON.parse(
                JSON.stringify(esdevenimentDetall.Preguntes)
              ),
              TransportAnada: false,
              TransportTornada: false,
              ConfirmacioTecnica: false,
              Transport: false,
              Observacions: "",
              NumAcompanyants: 0,
              DataModificacio: new Date(),
              Esdeveniment: idEsdeveniment,
            });
          }
        }
      });
      /** Delegats */
      esdevenimentDetall.Delegats = [];
      usuari.Delegacions.forEach((cas) => {
        let ass1 = esdevenimentDetall?.CastellersAssitiran?.find((ass) => {
          return ass.Casteller == cas;
        });
        if (ass1) {
          esdevenimentDetall.Preguntes.forEach((p1) => {
            let find = false;
            ass1?.Preguntes.forEach((p2) => {
              if (p1.IdPregunta == p2.IdPregunta) {
                find = true;
              }
            });
            if (!find) {
              ass1?.Preguntes.push(JSON.parse(JSON.stringify(p1)));
            }
          });
          esdevenimentDetall.Delegats.push(ass1);
        } else {
          let noass = esdevenimentDetall?.CastellersNoAssitiran?.find((ass) => {
            return ass.Casteller == cas;
          });
          if (noass) {
            // validem les preguntes s'han agregat noves
            esdevenimentDetall.Preguntes.forEach((p1) => {
              let find = false;
              noass?.Preguntes.forEach((p2) => {
                if (p1.IdPregunta == p2.IdPregunta) {
                  find = true;
                }
              });
              if (!find) {
                noass?.Preguntes.push(JSON.parse(JSON.stringify(p1)));
              }
            });
            esdevenimentDetall.Delegats.push(noass);
          } else {
            esdevenimentDetall.Delegats.push(<IAssistenciaModel>{
              Casteller: cas,
              TransportAnada: false,
              TransportTornada: false,
              ConfirmacioTecnica: false,
              Preguntes: JSON.parse(
                JSON.stringify(esdevenimentDetall.Preguntes)
              ),
              Transport: false,
              Observacions: "",
              NumAcompanyants: 0,
              DataModificacio: new Date(),
              Esdeveniment: idEsdeveniment,
            });
          }
        }
      });
      //Desar el calcul
      this.storeData.desarEsdevenimentsDetall(esdevenimentDetall);
      return esdevenimentDetall;
    } else throw new ErrorSenseInternet();
  }

  /**
   * Desar esdeveniment en el sistema
   * @param esdeveniment Esdeveniment objectiu
   * @param totElDia Si es dia total o no
   * @param loading variable de carrega
   */
  async desarEsdeveniment(
    esdeveniment: IEsdevenimentModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return await lastValueFrom(this.esdevenimentService
      .desarEsdeveniment(esdeveniment, user));
  }

  /**
   * Bloquejar esdeveniment
   * @param esd esdeveniment objecte del bloqueig
   * @param bloqueig Si es true es bloqueija, si es false es desbloqueja
   * @param loading variable de cargant part UI
   */
  async bloquejarEsdeveniment(
    esd: IEsdevenimentModel,
    bloqueig: boolean
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    if (bloqueig)
      return await lastValueFrom(this.esdevenimentService
        .bloquejarEsdeveniment(esd, user));
    else
      return await lastValueFrom(this.esdevenimentService
        .desBloquejarEsdeveniment(esd, user));
  }
  /**
   * Esborrar un esdeveniment del sistema
   * @param esd
   * @param loading
   */
  async esborrarEsdeveniment(
    esd: IEsdevenimentModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return await lastValueFrom(this.esdevenimentService.esborrarEsdeveniment(esd, user));
  }
  public async obtenirEsdevenimentServer(
    esd: string
  ): Promise<IEsdevenimentDetallModel> {
    let user = await this.storeData.obtenirUsuariSession();

    return await lastValueFrom(this.esdevenimentService
      .obtenirDetallEsdeveniments(esd, user));
  }
  /**
   * Anular un esdeveniment del sistema
   * @param esdeveniment
   * @param loading
   */
  async anularEsdeveniment(
    esdeveniment: IEsdevenimentModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return await lastValueFrom(this.esdevenimentService
      .anularEsdeveniment(esdeveniment, user));
  }
  /**
   * Activa  un esdeveniment anulat del sistema
   * @param esdeveniment
   * @param loading
   */
  async activarEsdeveniment(
    esdeveniment: IEsdevenimentModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();

    return await lastValueFrom(this.esdevenimentService
      .activarEsdeveniment(esdeveniment, user));
  }
  /**
   * Actualitza en la base de dades local les actualitzacions dels esdeveniments
   * @param esdeveniments Llista d'esdeveniments a actualitza
   */
  public async actualitzarEsdeveniments(
    esdeveniments: IEsdevenimentModel[]
  ): Promise<number> {
    let online = await this.storeData.esOnline();
    if (online) return 0; // no se actualiza si no es offline
    // si la llista esta plena

    if (esdeveniments.length > 0) {
      for (let index = 0; index < esdeveniments.length; index++) {
        const esdeveniment = esdeveniments[index];
        let esdAnt: IEsdevenimentModel | undefined = await this.obtenirEsdeveniment(
          esdeveniment.Id
        );
        if (esdeveniment.Actiu) {
          // Si es actiu
          // Agregem l'esdvenimenint
          this.storeData.desarEsdeveniment(esdeveniment);
        } else {
          // si no esta actiu, l'esborrem
          if (esdAnt) this.storeData.esborrarEsdeveniment(esdeveniment.Id);
        }
      }
      // refresquem la precarga dels esdeveniments actuals
      this.storeData.refrescarEsdevenimentsActuals();

      // persistem els calculs en la base de dades local
      await this.storeData.desarEsdevenimentsEnLocalDB();

      return esdeveniments.length;
    } else return 0;
  }
  /**
   * Obtenir Esdeveniments
   */
  public async obtenirEsdeveniments(): Promise<IEsdevenimentResumModel[]> {
    let online = await this.storeData.esOnline();
    let usuari = await this.storeData.obtenirUsuariSession();
    if (!online) return (await this.storeData.obtenirEsdeveniments()).Values();
    else
      return await lastValueFrom(this.esdevenimentService.obtenirEsdeveniments(usuari));
  }
  /**
   * Retorna l'esdeveniment objecte del ID
   * @param id Identificador de l esdeveniment
   */
  public obtenirEsdeveniment(id: string): Promise<IEsdevenimentModel | undefined> {
    return this.storeData.obtenirEsdeveniment(id);
  }
  /**
   * Desar Castell a esdevenimnet
   * @param castell
   * @returns
   */
  public async DesarCastell(
    castell: IEsdevenimentCastellModel
  ): Promise<IRespostaServidorAmbRetorn<IEsdevenimentCastellModel>> {
    let usuari = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.esdevenimentService
      .modificarCastell(castell, usuari));
  }
  /**
   * Esborrar Castell a esdevenimnet
   * @param castell
   * @returns
   */
  public async EsborrarCastell(
    castell: IEsdevenimentCastellModel
  ): Promise<IRespostaServidor> {
    let usuari = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.esdevenimentService
      .esborrarCastell(castell, usuari));
  }
  /**
   * Convertir EsdevenimentModel a EsdevenimentModelList
   * @param esd
   */
  public convertirAModelList(esd: IEsdevenimentModel): IEsdevenimentModelList {
    let esdList: IEsdevenimentModelList = <IEsdevenimentModelList>{
      Titol: esd.Titol,
      DataIni: esd.DataIni,
      DataFi: esd.DataFi,
      Icona: this.obtenirIconTipusEsdeveniments(esd),
      TipusEsdeveniment: esd.TipusEsdeveniment,
      Bloquejat: esd.Bloquejat,
      Descripcio: esd.Descripcio,
      OfereixTransport: esd.OfereixTransport,
      Temporada: esd.Temporada,
      Id: esd.Id,
      Confirmats: esd.Confirmats,
      Direccio: esd.Direccio,
      Assistire: esd.Assistire,
      Assistencia: esd.Assistencia,
      NoAssistencia: esd.NoAssistencia,
      Anulat: esd.Anulat,
      Actiu: esd.Actiu

    };
    return esdList;
  }
  /**
   * Convertir EsdevenimentModel en esdevimentModelList
   * @param esd
   */
  public convertirArrayAModelList(
    esd: IEsdevenimentModel[]
  ): IEsdevenimentModelList[] {
    let esdList: IEsdevenimentModelList[] = [];
    esd.forEach((obj) => esdList.push(this.convertirAModelList(obj)));
    return esdList;
  }

  /**
   * Obtenir Esdeveniments Historics
   * @param text  Text de la cerca
   * @param tipus tipus inclosos
   * @param regIni registre inicial
   */
  public async obtenirEsdevenimentsHistorics(
    text?: string,
    tipus?: IEntitatHelper[],
    regIni?: number
  ): Promise<IEsdevenimentModel[]> {
    let date: Date = new Date();
    let online = await this.storeData.esOnline();
    let usuari = await this.storeData.obtenirUsuariSession();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    let dateS: String = date.toISOString();
    let wtipus = tipus || [];

    if (!online) {
      let esdDic: Diccionari<IEsdevenimentModel> =
        await this.storeData.obtenirEsdeveniments();
      return esdDic
        .Values()
        .filter((it) => {
          if (it.DataFi.indexOf("T00:00:00") > 0)
            return it.DataFi.substring(0, 10) < dateS.substring(0, 10);
          else return it.DataFi < dateS;
        })
        .sort((n1, n2) => {
          if (n1.DataIni > n2.DataIni) {
            return -1;
          }
          if (n1.DataIni < n2.DataIni) {
            return 1;
          }
          return 0;
        })
        .filter((esdev) => {
          if (
            text &&
            esdev.Descripcio.toLowerCase().indexOf(text.toLowerCase()) <= -1 &&
            esdev.Titol.toLowerCase().indexOf(text.toLowerCase()) <= -1
          ) {
            return false;
          }
          if (tipus?.length == 0) return true;
          if (!tipus) return true;
          for (var z = 0; z < (wtipus.length || 0); z++) {
            if (wtipus[z].Id == esdev.TipusEsdeveniment) {
              return true;
            }
          }
          return false;
        });
    } else
      return await lastValueFrom(this.esdevenimentService
        .obtenirEsdevenimentsHistoric(
          text || "",
          wtipus.map((i) => {
            return i.Id;
          }),
          regIni ?? 0,
          usuari
        ));
  }

  /**
   * Obtenir Esdeveniment amb data
   * @param data
   */
  public async obtenirEsdevenimentsAData(
    data: Date
  ): Promise<IEsdevenimentModel[]> {
    let dateS: String = data.toISOString().substring(0, 10);
    return (await this.obtenirEsdeveniments()).filter((it) => {
      if (
        it.DataIni.substring(0, 10) <= dateS &&
        it.DataFi.substring(0, 10) >= dateS
      )
        return true;
      else return false;
    });
  }
}
