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

import { lastValueFrom } from 'rxjs';
import { Injectable } from "@angular/core";
import {
  IPaquetActualitzacio,
  IRespostaServidorAmbRetorn,
  IResultatPaquetActualitzacio,
  ITemporadaModel,
  IUsuariModel,
} from "../entities/interfaces";
import { StoreData } from "../services/storage.data";
import { HelperService } from "../services/helper.service";
import { CastellersService } from "../services/castellers.service";
import { EsdevenimentService } from "../services/esdeveniments.service";
import { AlbumService } from "../services/album.service";
import { NoticiesService } from "../services/noticies.service";
import { PaquetActualitzacioService } from "../services/paquetActualitzacio.service";
import { UsuariBs } from "./Usuari.business";
import { CastellersBs } from "./casteller.business";
import { EsdevenimentBs } from "./esdeveniments.business";
import { NoticiesBs } from "./noticies.business";
import { AlbumsBs } from "./albums.business";
import { UsuariService } from "../services/usuari.service";
import { TemporadaService } from "../services/temporada.service";
import { ErrorTemporadaBuida } from "../entities/Errors";

@Injectable({
  providedIn: "root",
})
export class SincronitzacioDBBs {
  constructor(
    protected castellersBs: CastellersBs,
    protected esdevenimentBs: EsdevenimentBs,
    protected noticiesBs: NoticiesBs,
    protected albumBs: AlbumsBs,
    protected usuariBs: UsuariBs,
    protected usuariService: UsuariService,
    protected paquetActualitzacioService: PaquetActualitzacioService,
    protected noticiesService: NoticiesService,
    protected albumService: AlbumService,
    protected esdevenimentService: EsdevenimentService,
    protected castellersService: CastellersService,
    protected temporadaService: TemporadaService,
    protected helperService: HelperService,
    protected storeData: StoreData
  ) { }
  public async obtenirDataUltimaActualitzacio(): Promise<string> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.paquetActualitzacioService
      .obtenirDataActualitzacio(user)
      .toPromise();
  }
  /**
   * Carregar les dades de publicacions Events i Noticies
   * @param mostraMissatge Per mostrar el missatge al usuari o no
   */
  public async actualitzarPaquets(): Promise<IResultatPaquetActualitzacio | undefined> {
    let online = await this.storeData.esOnline();
    if (online) return; // no se actualiza

    let data = await this.storeData.obtenirDataActualitzacio();
    let usuari = await this.storeData.obtenirUsuari();
    let user = await this.storeData.obtenirUsuariSession();
    this.usuariBs.esRolAdmin(usuari);
    let p = await lastValueFrom(await this.paquetActualitzacioService
      .obtenirPaquetActualitzacio(
        data,
        this.usuariBs.esRolCasteller(usuari),
        this.usuariBs.esRolJunta(usuari) ||
        this.usuariBs.esRolAdmin(usuari) ||
        this.usuariBs.esRolSecretari(usuari),
        this.usuariBs.esRolTecnica(usuari) ||
        this.usuariBs.esRolTecnicaNivell2(usuari),
        user
      ));
    if (p.Retorn.Temporada) {
      this.storeData.desarTemporada(p.Retorn.Temporada);
    } else {
      throw new ErrorTemporadaBuida(
        "Temporada no iniciada. Parla amb l'administrador"
      );
    }
    let castNum = await this.castellersBs.actualitzarCastellers(
      p.Retorn.Castellers
    );
    let esdNum = (p.Retorn.Esdeveniments) ? await this.esdevenimentBs.actualitzarEsdeveniments(
      p.Retorn.Esdeveniments
    ) : 0;
    let notNum = (p.Retorn.Noticies) ? await this.noticiesBs.actualitzarNoticies(
      p.Retorn.Noticies,
      p.Retorn.DataActualitzacio
    ) : 0;
    let fotNum = (p.Retorn.Albums) ? await this.albumBs.actualitzarAlbums(
      p.Retorn.Albums,
      p.Retorn.DataActualitzacio
    ) : 0;
    await this.storeData.desarDataActualitzacio(p.Retorn.DataActualitzacio);
    return <IResultatPaquetActualitzacio>{
      ActCastellers: castNum,
      ActEsdeveniments: esdNum,
      ActNoticies: notNum,
      ActFotos: fotNum,
    };
  }
  public async obtenirTemporadaActual(): Promise<ITemporadaModel> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.temporadaService.obtenirTemporadaActual(user));
  }
  /**
   * Validar Credencials
   */
  public async ValidarCredencials(): Promise<boolean> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<boolean>((resolve, reject) => {
      this.usuariService.obtenirUsuariActual(user).subscribe(
        (res) => {
          this.storeData.desarUsuari(res);
          resolve(true);
        },
        (errorResponse) => {
          // Permisos en la peticion
          if (errorResponse && errorResponse.status == 401) {
            resolve(false);
          } else if (
            errorResponse &&
            (errorResponse.status == 500 || errorResponse.status == 502)
          ) {
            console.error(errorResponse); //En el caso de no tener acceso al sistema se inhabilita el menu.
            reject("Error en el servidor, contacte amb el administrador");
          } else {
            console.error(errorResponse); //En el caso de no tener acceso al sistema se inhabilita el menu.
            if (errorResponse) reject(errorResponse);
            else reject("Error en la conexió a internet");
          }
        }
      );
    });
    return promise;
  }
  /**
   * Funcio per buscar si aquest usuari te un casteller assignat, donar-li el rol i aixi reactualizar les credencials
   * */
  public async RelacionarCastellerAmbUsuari(): Promise<
    IRespostaServidorAmbRetorn<IUsuariModel>
  > {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.usuariService.relacionarCastellerAmbUsuari(user));
  }
  public async actualitzarInformacioPublica() {
    await this.storeData.carregarLocalInformacioPublica();
  }
  /**
   * Sobreescribe las esdeveniments del servidor a la base de datos local del dispositivo
   * */
  public async sobreescriureEsdeveniments(): Promise<boolean> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<boolean>((resolve, reject) => {
      this.esdevenimentService.obtenirEsdeveniments(user).subscribe(
        (t) => {
          if (t) {
            this.esdevenimentBs.actualitzarEsdeveniments(t);
            resolve(true);
          } else {
            reject("No tens àcces al servei no ets un casteller autoritzat");
          }
        },
        (e) => {
          reject("No tens internet");
        }
      );
    });

    return promise;
  }
  /**
   * Sobreescribe las noticias del servidor a la base de datos local del dispositivo
   * */
  public async sobreescriureNoticiesiAlbums(
    dataActualitzacio: string
  ): Promise<boolean> {
    let album = await this.storeData.obtenirTemporada();
    let user = await this.storeData.obtenirUsuariSession();
    let lstNoticies = await this.noticiesService
      .obtenirNoticies(user)
      .toPromise();
    let lstAlbums = await this.albumService
      .obtenirAlbums(album.Id, user)
      .toPromise();

    if (lstNoticies) await this.noticiesBs.actualitzarNoticies(lstNoticies);
    if (lstAlbums) await this.albumBs.actualitzarAlbums(lstAlbums);
    return true;
  }
  /**
   * SobreEscriure Castellers
   */
  public async sobreescriureCastellers(): Promise<boolean> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<boolean>((resolve, reject) => {
      this.castellersService.obtenirCastellers(user).subscribe(
        (t) => {
          if (t) {
            this.storeData.inicialitzarCastellers(t);
            resolve(true);
          } else {
            reject("No tens àcces al servei no ets un casteller autoritzat");
          }
        },
        (e) => {
          console.warn(e);
          reject("Error en la conexió");
        }
      );
    });

    return promise;
  }
  /**
   * Sobre Escriure Tipus Basics
   */
  public async sobreescriureTipusBasics(): Promise<Boolean> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<Boolean>((resolve, reject) => {
      console.info("Buscar tipus basics");
      this.helperService.obtenirTipusBasics(user).subscribe(
        (p) => {
          this.storeData.desarTipusPosicions(p.TipusPosicio);
          this.storeData.desarTipusEsdeveniments(p.TipusEsdeveniments);
          this.storeData.desarTipusNoticies(p.TipusNoticies);
          this.storeData.desarTipusRelacio(p.TipusRelacio);
          this.storeData.desarTipusCastell(p.TipusCastells);
          this.storeData.desarTipusProves(p.TipusProves);
          this.storeData.desarTipusEstatCastell(p.TipusEstatCastells);
          this.storeData.desarTipusDocuments(p.TipusDocuments);
          resolve(true);
        },
        (err) => {
          console.warn("Error a l'actualizació de tipus Posicio");
          reject("Error en la conexió");
        }
      );
    });

    return promise;
  }
}
