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
import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  LoadingController,
  ToastController,
  GestureController,
} from "@ionic/angular";
import { StoreData } from "../../services/storage.data";
import { UsuariBs } from "src/app/business/Usuari.business";
import { TipusEsdevenimentPopUp } from "src/app/compartit/popups/tipusEsdeveniments.popup";
import { OverlayEventDetail } from "@ionic/core";
import { Data, Route, Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations";
import { PaginaNavegacio } from "src/app/compartit/components/PaginaNavegacio";
import { CalendarOptions, FullCalendarComponent } from "@fullcalendar/angular";
import { EsdevenimentBs } from "src/app/business/Esdeveniments.business";
@Component({
  selector: "agenda",
  templateUrl: "agenda.page.html",
  styleUrls: ["./agenda.page.scss"],
  animations: [
    trigger("swiped", [
      transition(
        "* => esquerra",
        animate(
          1000,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 1, offset: 1 }),
          ])
        )
      ),
      transition(
        "* => esquerra2",
        animate(
          1000,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 1, offset: 1 }),
          ])
        )
      ),
      transition(
        "* => dreta",
        animate(
          2000,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 1, offset: 1 }),
          ])
        )
      ),
      transition(
        "* => dreta2",
        animate(
          2000,
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 1, offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class AgendaPage extends PaginaNavegacio implements OnInit {
  @ViewChild("textCerca") textCerca: any;
  @ViewChild("content") content: ElementRef;
  @ViewChild("calendar") calendar: FullCalendarComponent;
  bmostraCerca: boolean = false;
  dayIndex: number = 0;
  queryText: string = "";
  tipusCerca: string = "actual";
  excludeTypes: any[] = [];
  confDate: string;
  tipusVista: string = "perMes";
  options: CalendarOptions = null;
  swiped: string = "";
  //calendarPlugins = [dayGridPlugin];
  eventsCalendar: any[];
  constructor(
    protected usuariBs: UsuariBs,
    protected esdevenimentBS: EsdevenimentBs,
    protected router: Router,
    protected alertCtrl: AlertController,
    protected loadingCtrl: LoadingController,
    protected modalCtrl: ModalController,
    protected gestureCtrl: GestureController,
    protected navCtrl: NavController,
    protected storeData: StoreData,
    protected toastCtrl: ToastController,
    protected modalController: ModalController
  ) {
    super(
      usuariBs,
      router,
      navCtrl,
      toastCtrl,
      alertCtrl,
      loadingCtrl,
      storeData
    );
    this.bmostraCerca = false;
  }

  /**
   * Metode per realitzar l'esdeveniment Swipe del calendari
   * @param event */

  onSwipe(event: any) {
    const type = event.type;
    const currentX = event.currentX;
    const deltaX = event.deltaX;
    const velocityX = event.velocityX;
    console.log(`${type} ${currentX} ${deltaX} ${velocityX}`);
    if (Math.abs(event.deltaX) > 40) {
      if (event.deltaX > 0) {
        this.swiped = this.swiped == "dreta" ? "dreta2" : "dreta";
        setTimeout(() => {
          let calendarApi = this.calendar.getApi();
          calendarApi.prev();
        }, 1000);
      } else {
        this.swiped = this.swiped == "esquerra" ? "esquerra2" : "esquerra";
        let calendarApi = this.calendar.getApi();
        calendarApi.next();
      }
    }
  }
  /**
   * Metode al entrar al formulari
   * */
  async ngOnInit() {
    const gesture = this.gestureCtrl.create({
      el: document.getElementById("content"),
      gestureName: "swipe",
      onEnd: (detail) => {
        this.onSwipe(detail);
      },
    });

    gesture.enable();
  }
  ionViewDidEnter() {
    this.canviarCerca();
  }
  /**
   * Canviar Cerca
   */
  async canviarCerca() {
    let lst = await this.esdevenimentBS.obtenirEsdeveniments();
    this.eventsCalendar = [];
    lst.forEach((ev) => {
      this.eventsCalendar.push({
        id: ev.Id,
        title: ev.Titol,
        start: ev.DataIni,
        end: ev.DataFi,
        color: ev.Assistire
          ? "#8F1F26"
          : ev.Assistire === false
          ? "#F4C641"
          : "#C0C0C0",
        textColor: "#FFFFFF",
      });
    });

    this.options = {
      initialView: "dayGridMonth",
      firstDay: 1,
      locale: "ca",
      buttonText: {
        today: "Avui",
        month: "Mes",
        week: "Setmana",
        day: "Dia",
        list: "Llista",
      },
      titleFormat: { year: "numeric", month: "short", day: "numeric" },
      eventClick: (info) => {
        this.navCtrl.navigateForward(`public/esdeveniment/${info.event.id}`);
      }, // bind is important!
      events: this.eventsCalendar,
      headerToolbar: {
        center: "title",
        start: "dayGridMonth,timeGridWeek",
        end: "prev,today,next",
      },
      dateClick: (e) => {},
      editable: false,
    };
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 1);
  }

  /**
   * Esdeveniment de cerca
   * @param ev
   */
  cercarEsdeveniments(ev: any) {
    var val = ev.target.value;
    this.canviarCerca();
  }

  /**
   * Metode de Presentacio de PopUp de filtres
   * */
  async presentFilter() {
    let modal = await this.modalCtrl.create({
      component: TipusEsdevenimentPopUp,
      componentProps: { excludeTypes: this.excludeTypes },
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail && detail.data) {
        console.log("The result:", detail.data);
        this.excludeTypes = detail.data;
      } else {
        this.excludeTypes = [];
      }
      this.canviarCerca();
    });
    modal.present();
  }

  /**
   * Metode per mostrar Cercar
   * */
  mostrarCerca() {
    if (!this.bmostraCerca) {
      this.bmostraCerca = true;
      setTimeout(() => {
        this.textCerca.setFocus();
      }, 150);
    } else {
      if (this.queryText != "") {
        this.queryText = "";
        this.canviarCerca();
        this.bmostraCerca = false;
      }
    }
  }
  /**
   * Si el text es buit amargar cercar en la ToolBar
   * */
  amagarCerca() {
    if (this.queryText == "") this.bmostraCerca = false;
  }

  canviVista() {
    this.navCtrl.navigateRoot(`public/agendalist`);
  }

  potCrear(): boolean {
    return true; // this.esdevenimentBS.potEditar(null);
  }
  anarACalendari() {}

  nouEsdeveniment(): void {}
}
