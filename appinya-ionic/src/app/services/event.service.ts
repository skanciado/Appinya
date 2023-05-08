import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private senseConexioSubject: Subject<boolean> = new Subject();
    private errorSubject: Subject<string> = new Subject();
    private credencialsSubject: Subject<string> = new Subject();
    enviarEventSenseConexio() {
        this.senseConexioSubject.next(false);
    }
    enviarEventConexioActiva() {
        this.senseConexioSubject.next(true);
    }
    enviarEventError(message: string) {
        this.errorSubject.next(message);
    }
    enviarEventCredebcials(message: string) {
        this.credencialsSubject.next(message);
    }
    obtenirObservableError(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void) {
        this.errorSubject.subscribe(
            {
                next: next,
                error: error,
                complete: complete
            }
        );
    }
    obtenirObservableCredebcials(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void) {
        this.credencialsSubject.subscribe(
            {
                next: next,
                error: error,
                complete: complete
            }
        );
    }
    obtenirObservableConexio(next?: (value: boolean) => void, error?: (error: any) => void, complete?: () => void) {
        this.senseConexioSubject.subscribe(
            {
                next: next,
                error: error,
                complete: complete
            }
        );
    }
}