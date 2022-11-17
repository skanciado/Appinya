import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
 
    private senseConexioSubject: Subject<Boolean> = new Subject();
    private errorSubject: Subject<string> = new Subject();
 
    enviarEventSenseConexio() { 
            this.senseConexioSubject.next(false); 
    }
    enviarEventConexioActiva() { 
            this.senseConexioSubject.next(true); 
    }
    enviarEventError(message:string) { 
        this.errorSubject.next(message); 
    }
    obtenirObservableError(next?: (value: string) => void, error?: (error: any) => void, complete?: () => void) {
        this.errorSubject.subscribe(next, error, complete);
    }
    obtenirObservableConexio(next?: (value: Boolean) => void, error?: (error: any) => void, complete?: () => void) {
        this.senseConexioSubject.subscribe(next, error, complete);
    }
}