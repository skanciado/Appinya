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
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ToastController, AlertController, NavController, LoadingController } from '@ionic/angular';

import { StoreData } from '../../services/storage.data';
import { UsuariService } from "../../services/usuari.service";
import { UsuariBs } from 'src/app/business/Usuari.business';
import { Router } from '@angular/router';
import { PaginaNavegacio } from 'src/app/compartit/components/PaginaNavegacio';
@Component({
    selector: 'acces-page',
    templateUrl: 'acces.page.html',
    styleUrls: ['./acces.page.scss'],
})
export class AccesPage extends PaginaNavegacio implements OnInit {

    constructor(
        usuariBs: UsuariBs,
        route: Router,
        navCtrl: NavController,
        toastCtrl: ToastController,
        alertCtrl: AlertController,
        loadingCtrl: LoadingController,
        storeData: StoreData,
        protected usuariService: UsuariService
    ) {
        super(usuariBs, route, navCtrl, toastCtrl, alertCtrl, loadingCtrl, storeData);
    }
    /**Carregar Pagina Principal */
    ngOnInit() {

    }
    /**
     * Anar a la pagina de login
     */
    iniciarSessio() {

        this.navegarAIniciarSessio();
    }

}

