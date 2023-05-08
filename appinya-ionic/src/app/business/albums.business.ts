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
import { Constants } from "../Constants";
import {
  INoticiaModel,
  IAlbumsModel,
  ILikesHelper,
  IRespostaServidorAmbRetorn,
  IRespostaServidor,
} from "../entities/interfaces";
import { AlbumService } from "../services/album.service";
import { StoreData } from "../services/storage.data";

@Injectable({
  providedIn: "root",
})
export class AlbumsBs {
  constructor(
    protected albumService: AlbumService,
    protected storeData: StoreData
  ) { }
  /**
   * Obtenir Album per Id
   * @param idAlbum
   * @returns
   */
  public async obtenirAlbumModel(idAlbum: string): Promise<IAlbumsModel | undefined> {
    return (await this.storeData.refrescaAlbums()).find((t) => {
      return t.Id == idAlbum;
    });
  }
  public async obtenirNoticiaServidor(id: string): Promise<IAlbumsModel | undefined> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.albumService.obtenirAlbum(id, user));
  }
  /**
   * Guarda en la capa de persistencia del dispositiu linformació actualitzada dels likes
   * @param fotos fotos actualitzades
   */
  public guardarAlbum(fotos: IAlbumsModel[]) {
    fotos.forEach((foto) => {
      if (foto.Activa) {
        this.storeData.desarAlbum(foto);
      } else {
        // Esborrar foto antiga
        this.storeData.esborrarNoticia(foto.Id);
      }
    });
  }
  /**
   * Actualitzacio de fotos en la base de dades local del dispositiu
   * @param fotos fotos actualitzades
   * @param dataActual data actual per saber les fotos
   */
  public async actualitzarAlbums(
    albums: IAlbumsModel[],
    dataActual?: String
  ): Promise<number> {
    let lstNotificacions: IAlbumsModel[] = [];
    if (!dataActual) dataActual = new Date().toJSON();
    if (albums) {
      albums.forEach((album) => {
        var index: number = -1;
        if (album.Activa) {
          this.storeData.desarAlbum(album);
          lstNotificacions.push(album);
        } else {
          // Esborrar foto antiga
          this.storeData.esborrarAlbum(album.Id);
        }
      });
      await this.storeData.desarAlbumEnLocalDB(); // desar en local tot
      return lstNotificacions.length;
    } else return 0;
  }

  /**
   * Desar Fotos en el sistema servidor
   * @param foto Foto objecte
   * @param loading Loading message
   */
  public async desarAlbum(
    foto: IAlbumsModel
  ): Promise<IRespostaServidorAmbRetorn<IAlbumsModel>> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<IRespostaServidorAmbRetorn<IAlbumsModel>>(
      (resolve, reject) => {
        this.albumService.desarAlbum(foto, user).subscribe(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
    return promise;
  }
  /**
   * Retornar l'historic de les fotos d'una temporada
   * @param loading
   * @param idTemporada
   */
  public async obtenirAlbumsHistorics(
    idTemporada: number
  ): Promise<IAlbumsModel[]> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.albumService.obtenirAlbums(idTemporada, user));
  }

  /**
   * Esborrar una Fotos
   * @param foto Foto objecte
   * @param loading Loading message
   */
  public async esborrar(foto: IAlbumsModel): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.albumService.esborrarAlbum(foto, user));
  }

  /**
   * Donar Like Fotos
   * @param foto  Foto objecte 
   */
  public async like(
    foto: IAlbumsModel
  ): Promise<IRespostaServidorAmbRetorn<number>> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.albumService.like(foto, user));
  }
  /**
   * Esborrar Like Fotos
   * @param foto  Foto objecte
   */
  public async eliminarLike(
    foto: IAlbumsModel
  ): Promise<IRespostaServidorAmbRetorn<number>> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.albumService.eliminarLike(foto, user));
  }

  /**
   * Obtenir els Likes de totes les fotos
   * @param idTemporada
   */
  public async obtenirLikes(idTemporada: number): Promise<ILikesHelper[]> {
    let user = await this.storeData.obtenirUsuariSession();
    return await lastValueFrom(this.albumService.obtenirLikes(idTemporada, user));
  }

  /**
   *  Guardar els Likes de totes les fotos
   */
  public async guardarLikes(likes: ILikesHelper[]): Promise<void> {
    for (let like of likes) {
      for (let foto of await this.storeData.obtenirAlbums()) {
        if (foto.Id == like.IdAlbum) {
          foto.JoLike = like.JoLike;
          foto.Likes = like.Likes;
          foto.estat = like.JoLike ? "active" : "inactive";
          this.storeData.desarAlbum(foto);
          break;
        }
      }
    }
    await this.storeData.desarAlbumEnLocalDB();
  }

  public obtenirAlbums(): Promise<IAlbumsModel[]> {
    return this.storeData.refrescaAlbums();
  }
}
