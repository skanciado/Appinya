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
import { Injectable } from '@angular/core';
import { StoreData } from '../services/storage.data';
import { UsuariService } from '../services/usuari.service';
import { Menu } from '../entities/Menu';
import { ErrorRefrescarCredencials } from '../entities/Errors';
import { ICastellerModel, IResumHomeModel } from '../entities/interfaces';
import { CastellersService } from '../services/castellers.service';
import { NoticiesService } from '../services/noticies.service';
import { EsdevenimentService } from '../services/esdeveniments.service';
import { DeviceService } from '../services/device.service';
import { HomeService } from '../services/home.service';
import { EsdevenimentBs } from './esdeveniments.business';
import { NoticiesBs } from './noticies.business';

/**
 * Gestor de Negoci de Usuaris
 * 
 * */
@Injectable({
    providedIn: 'root',
})
export class HomeBs {


    constructor(
        protected homeService: HomeService,
        protected esdevenimentBs: EsdevenimentBs,
        protected noticiesBs: NoticiesBs,
        protected deviceService: DeviceService,
        protected storeData: StoreData) {
    }
    public async ObtenirHome(): Promise<IResumHomeModel> {
        let online = await this.storeData.esOnline();
        let user = await this.storeData.obtenirUsuariSession();

        return {
            Esdeveniments: await this.esdevenimentBs.obtenirEsdevenimentsActuals(),
            Noticies: await this.noticiesBs.obtenirNoticiesActuals(0)
        }


    }

}
