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
import { Diccionari } from "../entities/Diccionari";
import {
  ICastellerModel,
  ICastellerDetallModel,
  IResponsableLegalModel,
  IRespostaServidorAmbRetorn,
  IRespostaServidor,
  IEntitatHelper,
} from "../entities/interfaces";
import { CastellersService } from "../services/castellers.service";
import { StoreData } from "../services/storage.data";
import { UsuariService } from "../services/usuari.service";

@Injectable({
  providedIn: "root",
})
export class CastellersBs {
  constructor(
    protected castellerService: CastellersService,
    protected usuariService: UsuariService,
    protected storeData: StoreData
  ) {}
  /**
   * Desar Casteller
   * @param casteller
   * @param loading
   */
  public async desaCasteller(
    casteller: ICastellerModel
  ): Promise<IRespostaServidorAmbRetorn<ICastellerModel>> {
    let user = await this.storeData.obtenirUsuariSession();
    var promise = new Promise<IRespostaServidorAmbRetorn<ICastellerModel>>(
      (resolve, reject) => {
        this.castellerService.desarCasteller(casteller, user).subscribe(
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
   * Esborrar Casteller
   * @param cas Casteller a esborrar
   * @param loading Loading
   */
  public async esborrarCasteller(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService.esborrarCasteller(cas, user).toPromise();
  }
  /**
   * Copia un esdeveniment però deixant-lo actiu a una altre esdeveniment
   * @param esdeveniment
   */
  public async clonarCastellerByModel(
    castellerWrk: ICastellerModel
  ): Promise<ICastellerModel> {
    return <ICastellerModel>{
      Id: castellerWrk.Id,
      Alias: castellerWrk.Alias,
      Assegurat: castellerWrk.Assegurat,
      ResponsablesLegals: castellerWrk.ResponsablesLegals,
      Carrec: castellerWrk.Carrec,
      CodiPostal: castellerWrk.CodiPostal,
      Cognom: castellerWrk.Cognom,
      IdTipusDocument: castellerWrk.IdTipusDocument,
      DataAlta: castellerWrk.DataAlta,
      DataBaixa: castellerWrk.DataBaixa,
      DataEntregaCamisa: castellerWrk.DataEntregaCamisa,
      DataNaixement: castellerWrk.DataNaixement,
      Document: castellerWrk.Document,
      Direccio: castellerWrk.Direccio,
      Email: castellerWrk.Email,
      Sanitari: castellerWrk.Sanitari,
      EsCascLloguer: castellerWrk.EsCascLloguer,
      TeCasc: castellerWrk.TeCasc,
      Edat: castellerWrk.Edat,
      RebreCorreuFotos: castellerWrk.RebreCorreuFotos,
      RebreCorreuNoticies: castellerWrk.RebreCorreuNoticies,
      EsBaixa: castellerWrk.EsBaixa,
      Foto: castellerWrk.Foto,
      IdUsuari: castellerWrk.IdUsuari,
      Municipi: castellerWrk.Municipi,
      IdProvincia: castellerWrk.IdProvincia,
      IdMunicipi: castellerWrk.IdMunicipi,
      Nom: castellerWrk.Nom,
      Provincia: castellerWrk.Provincia,
      TeCamisa: castellerWrk.TeCamisa,
      Telefon1: castellerWrk.Telefon1,
      Telefon2: castellerWrk.Telefon2,
      VisDataNaixement: castellerWrk.VisDataNaixement,
      VisDireccio: castellerWrk.VisDireccio,
      VisTelefon1: castellerWrk.VisTelefon1,
      VisTelefon2: castellerWrk.VisTelefon2,
      Habitual: castellerWrk.Habitual,
      Posicions: castellerWrk.Posicions,
      TipusDocument: castellerWrk.TipusDocument,
      Actiu: castellerWrk.Actiu,
    };
  }

  /**
   * Copia un esdeveniment però deixant-lo actiu a una altre esdeveniment
   * @param esdeveniment
   */
  public async clonarCasteller(idCasteller: string): Promise<ICastellerModel> {
    let castellerWrk: ICastellerModel = await this.obtenirCasteller(
      idCasteller
    );
    return this.clonarCastellerByModel(castellerWrk);
  }

  /**
   * Actualitza l'informacio de la base de dades local amb aquest nous castellers
   * @param castellers Castellers amb modificacions
   */
  public async actualitzarCastellers(
    castellers: ICastellerModel[]
  ): Promise<number> {
    if (castellers && castellers.length > 0) {
      castellers.forEach((casteller) => {
        if (casteller.Actiu) this.storeData.desarCasteller(casteller);
        else {
          if (this.obtenirCasteller(casteller.Id)) {
            this.storeData.esborrarCasteller(casteller.Id);
          }
        }
      });
      await this.storeData.desarCastellersEnLocalDB();
      return castellers.length;
    } else return 0;
  }
  /**
   * Obtenir la foto del casteller
   * @param id id del casteller
   */
  public async obtenirFotoCasteller(id: string): Promise<string> {
    let cas: ICastellerModel = await this.obtenirCasteller(id);
    return cas ? cas.Foto : null;
  }
  /**
   * Obtenir el casteller
   * @param id Id Casteller
   */
  public obtenirCasteller(id: string): Promise<ICastellerModel> {
    return this.storeData.obtenirCasteller(id);
  }
  /**
   * Retorna informació del casteller associada com rols usuari, estadistica completa .....
   * @param idCasteller
   */
  async obtenirCastellerDetall(
    idCasteller: string
  ): Promise<ICastellerDetallModel> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService
      .ObtenirCastellerDetall(idCasteller, user)
      .toPromise();
  }
  /**
   * Retorna informació del casteller associada com rols usuari, estadistica completa .....
   * */
  async obtenirCastellerDetallPerUsuari(): Promise<ICastellerDetallModel> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService
      .ObtenirCastellerDetallPerUsuari(user)
      .toPromise();
  }
  /**
   * Retorna els castellers amb la llista de ids enviat
   * @param ids ids dels castellers
   */
  public async obtenirCastellersByIds(
    ids: string[]
  ): Promise<ICastellerModel[]> {
    let castDic: Diccionari<ICastellerModel> = await this.storeData.obtenirDictionaryCastellers();
    let list: ICastellerModel[] = [];
    ids.forEach((id) => {
      if (castDic.ContainsKey(id)) list.push(castDic.Item(id));
    });
    return list;
  }

  /**
   * Returna la llista de castellers
   * */
  public async obtenirCastellers(
    text?: string,
    posisions?: string[]
  ): Promise<ICastellerModel[]> {
    return (await this.storeData.obtenirCastellers()).filter((item) => {
      let nom: String = item.Nom.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );

      let cognom: String = item.Cognom.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      let alias: String = item.Alias.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );

      if (posisions && posisions.length > 0) {
        if (item.Posicions) {
          var findpos: Boolean = false;
          var indexWrk: number = item.Posicions.findIndex((t) => {
            var index: number = posisions.findIndex((d) => {
              if (d == t.IdPosicio) return true;
              else return false;
            });
            if (index >= 0) return true;
            else return false;
          });
          if (indexWrk < 0) return false;
        } else return false;
      }
      if (text) {
        let nomComplet: string = nom.toLowerCase() + " " + cognom.toLowerCase();
        let queryNormal: String = text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        if (nom.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
          return true;
        if (cognom.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
          return true;
        if (alias.toLowerCase().indexOf(queryNormal.toLowerCase()) > -1)
          return true;
        if (nomComplet.indexOf(queryNormal.toLowerCase()) > -1) return true;
        return false;
      } else return true;
    });
  }
  /** Obtenir la base de dades amb els castellers ordenats per habitualitat i ordre alfabetic */
  public async obtenirCastellersOrdenats(
    text?: string,
    posisions?: string[]
  ): Promise<ICastellerModel[]> {
    let lst = await this.obtenirCastellers(text, posisions);
    return lst.sort((cas1, cas2) => {
      if (cas1.Habitual == true && cas2.Habitual == false) return -100;
      else if (cas1.Habitual == false && cas2.Habitual == true) return 100;

      if (cas1.Alias > cas2.Alias) return 1;
      else if (cas1.Alias < cas2.Alias) return -1;
      if (cas1.Nom > cas2.Nom) return 1;
      else if (cas1.Nom < cas2.Nom) return -1;
      return 0;
    });
  }
  /**
   * Si te camisa o no
   * @param cas
   */
  async teCamisa(cas: ICastellerModel): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService.teCamisa(cas, user).toPromise();
  }
  /**
   * Vol Rebre noticies al correo electronic el casteller loginejat
   * @param rebre
   */
  async rebreEmailNoticies(rebre: boolean): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.rebreCorreusNoticies(rebre, user).toPromise();
  }
  /**
   * Vol Rebre fotos al correo electronic el casteller loginejat
   * @param rebre
   */
  async rebreEmailFotos(rebre: boolean): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.rebreCorreuFotos(rebre, user).toPromise();
  }
  /**
   * Guardar la foto al servidor
   * @param foto
   * @param idCasteller
   */
  public async desarFoto(
    foto: string,
    idCasteller: string
  ): Promise<IRespostaServidorAmbRetorn<string>> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService
      .desarFotoByCasteller(foto, idCasteller, user)
      .toPromise();
  }
  /**
   * Esborrar delegacio d'assitencia d'un casteller
   * @param receptor
   * @param emisor
   */
  public async esborrarDelegacio(
    receptor: ICastellerModel,
    emisor: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService
      .esborrarDelegacio(receptor, emisor, user)
      .toPromise();
  }
  /**
   * Crear delegacio d'assitencia d'un casteller
   * @param receptor
   * @param emisor
   */
  public async crearDelegacio(
    receptor: ICastellerModel,
    emisor: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService
      .crearDelegacio(receptor, emisor, user)
      .toPromise();
  }
  /**
   *Exportar la base de dades casteller en excel
   * */
  public async exportarExcel(): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService.enviarCorreuExportacio(user).toPromise();
  }
  /**
   * Guardar un responsable legal al casteller
   * @param res
   */
  public async desarResponsableLegal(
    res: IResponsableLegalModel
  ): Promise<IRespostaServidorAmbRetorn<IResponsableLegalModel>> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService.desarResponsableLegal(res, user).toPromise();
  }
  /**
   * Esborrar Responsable Legal
   * @param idCasteller
   * @param idTipusResponsable
   */
  public async esborrarResponsableLegal(
    idCasteller: string,
    idTipusResponsable: string
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService
      .esborrarResponsableLegal(idCasteller, idTipusResponsable, user)
      .toPromise();
  }
  /**
   * Enviar Invitacio
   * @param cas
   */
  public async enviaInvitacio(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.enviaInvitacio(cas, user).toPromise();
  }
  /**
   * Esborrar Invitacio
   * @param cas
   */
  public async esborrarInvitacio(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.esborrarInvitacio(cas, user).toPromise();
  }
  /**
   * Crear Referenciat Tecnic
   * @param cas
   */
  public async crearReferenciat(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService.crearReferenciatTecnic(cas, user).toPromise();
  }
  /**
   * Esborrar Referenciat Tecnic
   * @param cas
   */
  public async esborrarReferenciat(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.castellerService
      .esborrarReferenciatTecnic(cas, user)
      .toPromise();
  }
  /**
   * Acceptar Solicitud
   * @param cas
   */
  public async acceptarInvitacio(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.acceptarInvitacio(cas, user).toPromise();
  }
  /**
   * Esborrar Solicitud
   * @param cas
   */
  public async esborrarSolicitud(
    cas: ICastellerModel
  ): Promise<IRespostaServidor> {
    let user = await this.storeData.obtenirUsuariSession();
    return this.usuariService.esborrarSolicitud(cas, user).toPromise();
  }
}
