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
import {
  INoticiaModel,
  IRespostaServidorAmbRetorn,
  IRespostaServidor,
} from "../entities/interfaces";
import { NoticiesService } from "../services/noticies.service";
import { StoreData } from "../services/storage.data";

@Injectable({
  providedIn: "root",
})
export class NoticiesBs {
  constructor(
    protected noticiesService: NoticiesService,
    protected storeData: StoreData
  ) {}

  /**
   * Actualitzacio de noticies i fotos en la base de dades local del dispositiu
   * @param noticies Noticies actualitzades
   * @param fotos fotos actualitzades
   * @param dataActual data actual per saber les noticies antigues
   */
  public async actualitzarNoticies(
    noticies: INoticiaModel[],
    dataActual?: string
  ): Promise<number> {
    let lstNotificacions: INoticiaModel[] = [];
    if (!dataActual) dataActual = new Date().toJSON();

    if (noticies) {
      noticies.forEach((noticia) => {
        var index: number = -1;
        if (
          noticia.Activa &&
          (noticia.Indefinida ||
            noticia.Data.substring(0, 10) >= dataActual.substring(0, 10))
        ) {
          this.storeData.desarNoticia(noticia);
          lstNotificacions.push(noticia);
        } else {
          // Esborrar Noticia antiga
          this.storeData.esborrarNoticia(noticia.Id);
        }
      });
      await this.storeData.refrescaNoticies(); // desar en local tot

      return lstNotificacions.length;
    } else return 0;
  }
  /**
   * Retorna les noticies del servidor
   * @param reg Numero del registre per on comença a fer la select
   * @param loading Loading message
   */
  public async obtenirNoticiesActuals(reg: number): Promise<INoticiaModel[]> {
    let online = await this.storeData.esOnline();
    let user = await this.storeData.obtenirUsuariSession();
    if (online) {
      return this.noticiesService.obtenirActuals(reg, "", user).toPromise();
    } else {
      return this.storeData.obtenirNoticies();
    }
  }
  /**
   * Retorna les noticies del servidor (no es guarden les antigues en el dispostius)
   * @param reg Numero del registre per on comença a fer la select
   * @param loading Loading message
   */
  public async obtenirHistoricNoticies(reg: number): Promise<INoticiaModel[]> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.noticiesService.obtenirHistoric(reg, "", user).toPromise();
  }
  /**
   * OBtenir Noticia del servidor
   * @param id
   * @returns
   */
  public async obtenirNoticiaServidor(id: string): Promise<INoticiaModel> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.noticiesService.obtenirNoticia(id, user).toPromise();
  }
  /**
   * Desar Noticia en el sistema servidor
   * @param noticia Noticia objecte
   * @param loading Carregant
   */
  public async desarNoticia(
    noticia: INoticiaModel
  ): Promise<IRespostaServidorAmbRetorn<INoticiaModel>> {
    let user = await this.storeData.obtenirUsuariSession();

    return this.noticiesService.desarNoticia(noticia, user).toPromise();
  }
  /**
   * Esborrar una noticia
   * @param noticia Noticia objecte
   * @param loading Loading
   */
  public async esborrarNoticia(
    noticia: INoticiaModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.noticiesService.esborrarNoticia(noticia, user).toPromise();
  }
  /**
   * Obtenir Noticia Model
   * @param idNoticia
   * @returns
   */
  public async obtenirNoticiaModel(idNoticia: string): Promise<INoticiaModel> {
    return (await this.storeData.obtenirNoticies()).find((t) => {
      return t.Id == idNoticia;
    });
  }
}
