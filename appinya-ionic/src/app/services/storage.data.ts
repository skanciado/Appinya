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
import { Storage } from "@ionic/storage";
import {
  IEntitatHelper,
  IAlbumsModel,
  ITemporadaModel,
  IEsdevenimentResumModel,
  IEsdevenimentDetallModel,
  INoticiaModel,
  ICastellerModel,
  IUsuariModel,
  IUsuariSessio,
  IEsdevenimentDetallFormModel,
} from "../entities/interfaces";
import { Diccionari } from "../entities/Diccionari";

import { ErrorLocalStore } from "../entities/Errors";
@Injectable({
  providedIn: "root",
})
export class StoreData {
  /*Variables de Session Activa*/
  private _esdevenimentsActuals: IEsdevenimentResumModel[] = [];
  private _esdeveniments: Diccionari<IEsdevenimentResumModel>;
  private _esdevenimentsDetall: Diccionari<IEsdevenimentDetallFormModel>;
  private _castellers: Diccionari<ICastellerModel> = null;
  private _noticies: INoticiaModel[] = [];
  private _albums: IAlbumsModel[] = [];

  private _loadStore: Boolean = false;
  /* PARAMETROS DE MEMORIA */
  private USER_INFO = "USUARI";
  private USER_SESSIO = "SESSIO";
  private TEMPORADA = "TEMPORADA";
  private CALENDARI = "CALENDARI";
  private ESDEVENIMENT_DETALL = "CALENDARI_DETALL";
  private CASTELLERS = "PERSONES";
  private NOTICIES = "NOTICIES";
  private ALBUMS = "ALBUMS";
  private VERSIO = "VERSIO";
  private ONLINE = "ONLINE";
  private TIPUS_ESDEVENIMENTS = "TIPUS_ESDEVENIMENTS";
  private TIPUS_NOTICIES = "TIPUS_NOTICIES";
  private TIPUS_RELACIONS = "TIPUS_RELACIONS";

  private TIPUS_CASTELL = "TIPUS_CASTELL";

  private TIPUS_PROVES = "TIPUS_PROVES";
  private TIPUS_ESTAT_CASTELL = "TIPUS_ESTAT_CASTELL";
  private TIPUS_DOCUMENT = "TIPUS_DOCUMENT";
  private DATE_ACTUALITZACIO = "DATA_ACTUALITZACIO";
  private PRIMERA_SINCRONITZACIO = "SINCRONITZACIO";
  private TIPUS_POSICIONS = "TIPUS_POSICIONS";
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this._storage.set("TEST", "TEST");
  }
  /**
   * Carregar de la informacio Publica de la app Noticies,Esdeveniments ....
   */
  public carregarLocalInformacioPublica(): Promise<Boolean> {
    console.info("Carregant informació pública");
    var p1: Promise<void> = this._storage.get(this.CALENDARI).then((value) => {
      this._esdeveniments = new Diccionari();
      if (value) {
        (value as Array<IEsdevenimentResumModel>).forEach((es) => {
          this._esdeveniments.Add(es.Id, es);
        });
      }
    });

    var p2: Promise<void> = this._storage.get(this.NOTICIES).then((value) => {
      this._noticies = value || [];
    });

    var p6: Promise<void> = this._storage.get(this.ALBUMS).then((value) => {
      this._albums = value || [];
    });

    return Promise.all([p1, p2, p6]).then((t) => {
      this._loadStore = true;
      return true;
    });
  }

  /**
   * Carregar Local dels castellers de la base de dades
   */
  public async carregarLocalCastellers(): Promise<Boolean> {
    console.info("Carregant informació Castellers");
    let value2 = await this._storage.get(this.CALENDARI);
    let value = await this._storage.get(this.CASTELLERS);
    this._castellers = new Diccionari();
    if (value)
      (value as Array<ICastellerModel>).forEach((es) => {
        this._castellers.Add(es.Id, es);
      });
    return true;
  }
  /**
   * Desar l'usuari ha demanat que sigui online
   */
  public desarOnline(online: boolean): Promise<any> {
    return this._storage.set(this.ONLINE, online);
  }
  /**
   * L'usuari ha demanat que sigui online
   */
  public esOnline(): Promise<boolean> {
    return this._storage.get(this.ONLINE);
  }
  /**
   * Obtenir Tipus de Noticies
   */
  public obtenirTipusNoticies(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_NOTICIES);
  }

  /**
   * Obtenir Tipus Esdeveniments
   */
  public obtenirTipusEsdeveniments(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_ESDEVENIMENTS);
  }
  /**
   * Obtenir Tipus Relacions
   */
  public obtenirTipusRelacions(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_RELACIONS);
  }
  /**
   * Obtenir Tipus Castells
   */
  public obtenirTipusCastell(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_CASTELL);
  }
  /**
   * Obtenir Tipus Proves Castells
   */
  public obtenirTipusProves(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_PROVES);
  }
  /**
   * Obtenir Tipus Estat Castells
   */
  public obtenirTipusEstatCastell(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_ESTAT_CASTELL);
  }
  /**
   * Desar tipus de Noticies
   */
  public desarTipusNoticies(tipusNotices: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_NOTICIES, tipusNotices);
  }
  /**
   * Desar Tipus de Relacio
   * @param lstTipus
   */
  public desarTipusRelacio(lstTipus: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_RELACIONS, lstTipus);
  }
  /**
   * Desar Tipus Castell
   * @param lstTipus
   */
  public desarTipusCastell(lstTipus: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_CASTELL, lstTipus);
  }
  /**
   * Desar Tipus Proves
   * @param lstTipus
   */
  public desarTipusProves(lstTipus: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_PROVES, lstTipus);
  }
  /**
   * Desar Tipus Relacions
   * @param lstTipus
   */
  public desarTipusEstatCastell(lstTipus: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_ESTAT_CASTELL, lstTipus);
  }

  public desarTipusDocuments(lstTipus: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_DOCUMENT, lstTipus);
  }
  /**
   * Obtenir Relacio
   */
  public obtenirTipusRelacio(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_RELACIONS);
  }
  public obtenirTipusDocument(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_DOCUMENT);
  }
  /**
   * Desar Tipus d'esdeveniments
   * @param lstTipus
   */
  public desarTipusEsdeveniments(lstTipus: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_ESDEVENIMENTS, lstTipus);
  }
  /**
   * Obtenir Tipus de Posicions
   */
  public obtenirTipusPosicions(): Promise<IEntitatHelper[]> {
    return this._storage.get(this.TIPUS_POSICIONS);
  }
  /**
   * Desar Tipus de Posicions
   * @param posicions
   */
  public desarTipusPosicions(posicions: IEntitatHelper[]): Promise<any> {
    return this._storage.set(this.TIPUS_POSICIONS, posicions);
  }

  /**
   * Obteinir la informacio del usuari logineixat
   * */
  public obtenirUsuariSession(): Promise<IUsuariSessio> {
    return this._storage.get(this.USER_SESSIO);
  }
  /**
   * Obteinir la informacio del Token
   * */
  public async obtenirToken(): Promise<String> {
    let user = await this._storage.get(this.USER_SESSIO);
    return user ? user.Token : null;
  }
  /**
   * Obteinir la informacio del Refresh Token
   * */
  public async obtenirRefreshToken(): Promise<String> {
    let user = await this._storage.get(this.USER_SESSIO);
    return user ? user.Token : null;
  }
  /**
   * Guarda l'usuari en la sessio'
   * @param user
   */
  public async desarUsuariSessio(user: IUsuariSessio): Promise<any> {
    return this._storage.set(this.USER_SESSIO, user);
  }

  /**
   * Mostra si s'ha finalitzat el proces de sincronitzacio
   * */
  public obtenirPrimeraSincronitzacio(): Promise<boolean> {
    return this._storage.get(this.PRIMERA_SINCRONITZACIO);
  }

  /**
   * Desar la variable per saber si la versió s'ha sincronitzat la primera vegada que es logineixa
   * @param isPrimera
   */
  public desarPrimeraSincronitzacio(isPrimera: boolean): Promise<any> {
    return this._storage.set(this.PRIMERA_SINCRONITZACIO, isPrimera);
  }

  /**
   *
   * Obtenir la base de dades de castellers local
   * */
  public async obtenirCasteller(id: string): Promise<ICastellerModel> {
    if (!this._castellers) {
      let lst: ICastellerModel[] = await this._storage.get(this.CASTELLERS);
      this.inicialitzarCastellers(lst);
    }
    return this._castellers.Item(id);
  }
  /**
   *
   * Obtenir la base de dades de castellers local
   * */
  public async obtenirCastellers(): Promise<ICastellerModel[]> {
    if (!this._castellers) {
      let lst: ICastellerModel[] = await this._storage.get(this.CASTELLERS);
      this.inicialitzarCastellers(lst);
    }
    return this._castellers.Values();
  }
  public async obtenirDictionaryCastellers(): Promise<
    Diccionari<ICastellerModel>
  > {
    if (!this._castellers) {
      let lst: ICastellerModel[] = await this._storage.get(this.CASTELLERS);
      this.inicialitzarCastellers(lst);
    }
    return this._castellers;
  }
  /**
   * inicialitzar la base de dades local
   * @param castellers
   */
  public inicialitzarCastellers(castellers: ICastellerModel[]): void {
    this._castellers = new Diccionari();
    if (castellers) {
      castellers.forEach((casteller) => {
        if (casteller.Actiu) this._castellers.Add(casteller.Id, casteller);
        // Object.assign(new ICastellerModel, casteller));
        else {
          if (this._castellers.ContainsKey(casteller.Id)) {
            this._castellers.Remove(casteller.Id);
          }
        }
      });
      this._storage.set(this.CASTELLERS, this._castellers.Values());
    }
  }

  /**
   * Desar Castellers en la base de dades
   * */
  public async desarCastellersEnLocalDB(): Promise<void> {
    return this._storage.set(this.CASTELLERS, this._castellers.Values());
  }

  /**
   * Esborrara casteller de la base de dades local
   * @param id
   */
  public esborrarCasteller(id: string): void {
    this._castellers.Remove(id);
  }

  /**
   * Desar un casteller
   * @param casteller
   */
  public async desarCasteller(casteller: ICastellerModel) {
    if (!this._castellers) {
      let b = await this.carregarLocalCastellers();
    }
    this._castellers.Add(casteller.Id, casteller); //Object.assign(new ICastellerModel, casteller));
  }

  /**
   * Refrescar Noticies en la base de dades local
   * */
  public async refrescaNoticies(): Promise<INoticiaModel[]> {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    if (!this._noticies) return [];
    this._noticies = this._noticies.sort((n1, n2) => {
      if (n1.Data < n2.Data) return 1;
      //if (n1.Indefinida != n2.Indefinida && n2.Indefinida) return 1;
      if (n1.Data > n2.Data) return -1;
      //if (n1.Indefinida != n2.Indefinida && n1.Indefinida) return -1;
      return 0;
    });
    await this._storage.set(this.NOTICIES, this._noticies);

    return this._noticies;
  }

  /**
   * Refrescar fotos en la base de dades local
   * */
  public async refrescaAlbums(): Promise<IAlbumsModel[]> {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    if (!this._albums) return [];

    this._albums = this._albums.sort((n1, n2) => {
      if (n1.Data < n2.Data) return 1;
      //if (n1.Indefinida != n2.Indefinida && n2.Indefinida) return 1;
      if (n1.Data > n2.Data) return -1;
      //if (n1.Indefinida != n2.Indefinida && n1.Indefinida) return -1;
      return 0;
    });
    await this._storage.set(this.ALBUMS, this._albums);
    return this._albums;
  }

  /**
   *Refrescar Esdeveniments actuals en la base de dades local
   */
  public async refrescarEsdevenimentsActuals() {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    let date: Date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    let dateS: String = date.toISOString();

    if (this._esdeveniments) {
      this._esdevenimentsActuals = this._esdeveniments
        .Values()
        .filter((it) => {
          if (
            it.DataIni.indexOf("T00:00:00") > 0 &&
            it.DataIni.substring(0, 10) >= dateS.substring(0, 10)
          )
            return true;
          else if (
            it.DataFi.indexOf("T00:00:00") > 0 &&
            it.DataFi.substring(0, 10) >= dateS.substring(0, 10)
          )
            return true;
          else return it.DataFi >= dateS;
        })
        .sort((n1, n2) => {
          if (n1.DataIni > n2.DataIni) {
            return 1;
          }
          if (n1.DataIni < n2.DataIni) {
            return -1;
          }
          return 0;
        });
    }
  }

  /**
   * Retorna els esdeveniments Actuals
   */
  public async obtenirEsdevenimentsActuals(): Promise<
    IEsdevenimentResumModel[]
  > {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }

    this.refrescarEsdevenimentsActuals();

    return this._esdevenimentsActuals;
  }

  /**
   * Retorna el diccionari d'esdeveniments
   * */
  public async obtenirEsdeveniments(): Promise<
    Diccionari<IEsdevenimentResumModel>
  > {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }

    if (!this._esdeveniments) this._esdeveniments = new Diccionari();
    return this._esdeveniments;
  }
  public async obtenirEsdeveniment(
    id: string
  ): Promise<IEsdevenimentResumModel> {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    if (!this._esdeveniments) return null;
    if (this._esdeveniments.ContainsKey(id))
      return this._esdeveniments.Item(id);
  }

  public async obtenirEsdevenimentDetall(
    id: string
  ): Promise<IEsdevenimentDetallFormModel> {
    if (!this._esdevenimentsDetall) {
      console.info("Cargar Diccionari Esdeveniment Detall");
      let value = await this._storage.get(this.ESDEVENIMENT_DETALL);
      this._esdevenimentsDetall = new Diccionari();
      if (value) {
        (value as Array<IEsdevenimentDetallFormModel>).forEach((es) => {
          this._esdevenimentsDetall.Add(es.Id, es);
        });
      }
    }

    if (this._esdevenimentsDetall.ContainsKey(id))
      return this._esdevenimentsDetall.Item(id);
    else return null;
  }
  /**
   * Desar esdeveniments en la base de dades local
   * */
  public async desarEsdevenimentsEnLocalDB() {
    if (!this._loadStore) {
      return;
    }
    await this._storage.set(this.CALENDARI, this._esdeveniments.Values());
  }
  /**
   * Desar esdeveniments en la base de dades local
   * */
  public async desarEsdevenimentsDetall(
    esdeveniment: IEsdevenimentDetallFormModel
  ) {
    this._esdevenimentsDetall.Add(esdeveniment.Id, esdeveniment);
    await this._storage.set(
      this.ESDEVENIMENT_DETALL,
      this._esdevenimentsDetall.Values()
    );
  }
  /**
   * Esborrar esdevniment en la base de dades local
   * @param id
   */
  public esborrarEsdeveniment(id: string): void {
    this._esdeveniments.Remove(id);
  }

  /**
   * Desar un esdeveniment en la base de dadeslocal
   * @param esdeveniment
   */
  public async desarEsdeveniment(esdeveniment: IEsdevenimentResumModel) {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    this._esdeveniments.Add(esdeveniment.Id, esdeveniment);
  }

  /**
   * Desar noticies en local
   * */
  public desarNoticiesEnLocalDB(): void {
    this._storage.set(this.NOTICIES, this._noticies);
  }

  /**
   * Esborrar una noticia en local
   * @param id
   */
  public async esborrarNoticia(id: string) {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    if (!this._noticies) return;
    var index: number = (index = this._noticies.findIndex((item) => {
      return item.Id == id;
    }));
    if (index !== -1) {
      this._noticies.splice(index, 1);
    }
  }

  /**
   * Desar una noticia en local
   * @param noticia
   */
  public async desarNoticia(noticia: INoticiaModel) {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    if (!this._noticies) this._noticies = [];
    let index: number = this._noticies.findIndex((item) => {
      return item.Id == noticia.Id;
    });
    if (index !== -1) {
      this._noticies[index] = noticia;
    } else {
      // NOU
      this._noticies.push(noticia);
    }
  }

  /**
   * Desaruna fotos en local
   * */
  public async desarAlbumEnLocalDB(): Promise<void> {
    if (!this._loadStore) {
      return;
    }
    await this._storage.set(this.ALBUMS, this._albums);
  }

  /**
   * Esborrar les fotos en local
   * @param id
   */
  public esborrarAlbum(id: string): void {
    var index: number = (index = this._albums.findIndex((item) => {
      return item.Id == id;
    }));
    if (index !== -1) {
      this._albums.splice(index, 1);
    }
  }
  /**
   * Desar fotos en local
   * @param foto
   */
  public async desarAlbum(foto: IAlbumsModel) {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Esdeveniments [loadStore]"
        );
    }
    if (!this._albums) this._albums = [];
    let index: number = this._albums.findIndex((item) => {
      return item.Id == foto.Id;
    });
    if (index !== -1) {
      this._albums[index] = foto;
    } else {
      // NOU
      this._albums.push(foto);
    }
  }
  /**
   * Desar data d'actualitzacio en les dades d'actualitzacio
   * @param date
   */
  public desarUsuari(usuari: IUsuariModel): Promise<any> {
    return this._storage.set(this.USER_INFO, usuari);
  }
  /**
   * Obtenir Usuari del Model
   */
  public async obtenirUsuari(): Promise<IUsuariModel> {
    return this._storage.get(this.USER_INFO);
  }

  /**
   * Desar data d'actualitzacio dels tipus basic
   * @param date
   */
  public desarDataActualitzacio(date: string): Promise<any> {
    return this._storage.set(this.DATE_ACTUALITZACIO, date);
  }
  /**
   * Obtenir la versio de la base de dades del mobil
   * */
  public obtenirDataActualitzacio(): Promise<string> {
    return this._storage.get(this.DATE_ACTUALITZACIO);
  }

  /**
   * Obtenir la versio de la base de dades del mobil
   * */
  public obtenirVersioDB(): Promise<number> {
    return this._storage.get(this.VERSIO);
  }
  /**
   * Desar versio de la base de dades
   * @param versio
   */
  public desarVersioDB(versio: number): Promise<any> {
    return this._storage.set(this.VERSIO, versio);
  }

  /**
   * Obtenir les noticies locals
   * */
  public async obtenirNoticies(): Promise<INoticiaModel[]> {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore(
          "Error en la lectura de Noticies [loadStore]"
        );
    }
    if (!this._noticies) return [];
    return this._noticies;
  }

  /**
   * Obtenir les fotos locals
   * */
  public async obtenirAlbums(): Promise<IAlbumsModel[]> {
    if (!this._loadStore) {
      await this.carregarLocalInformacioPublica();
      if (!this._loadStore)
        throw new ErrorLocalStore("Error en la lectura de Albums [loadStore]");
    }
    if (!this._albums) return [];
    return this._albums;
  }
  /**
   * Obtenir la temporada
   */
  public obtenirTemporada(): Promise<ITemporadaModel> {
    return this._storage.get(this.TEMPORADA);
  }
  /**
   * Desar temporada
   * @param temp
   */
  public desarTemporada(temp: ITemporadaModel): Promise<any> {
    return this._storage.set(this.TEMPORADA, temp);
  }

  /**
   * Esborra les variables que no son de sessio.
   */
  public async cleanMemoria() {
    let usr = await this.obtenirUsuariSession();
    await this._storage.clear();
    this.desarUsuariSessio(usr);
    this._noticies = [];
    this._loadStore = true;
    this._albums = [];
    this._esdeveniments = new Diccionari<IEsdevenimentResumModel>();
    this._esdevenimentsDetall = new Diccionari<IEsdevenimentDetallFormModel>();
    this._castellers = new Diccionari<ICastellerModel>();
  }
}
