import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { FuseAlertData } from './alert.data';

@Injectable({
    providedIn: 'root'
})
export class FuseAlertService
{
    private readonly _onDismiss: ReplaySubject<string> = new ReplaySubject<string>(1);
    private readonly _onShow: ReplaySubject<string> = new ReplaySubject<string>(1);
    private _fuseAlertData: BehaviorSubject<FuseAlertData | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for onDismiss
     */
    get onDismiss(): Observable<any>
    {
        return this._onDismiss.asObservable();
    }

    /**
     * Getter for onShow
     */
    get onShow(): Observable<any>
    {
        return this._onShow.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert
     *
     * @param name
     */
    dismiss(name: string): void
    {
        // Return if the name is not provided
        if ( !name )
        {
            return;
        }

        // Execute the observable
        this._onDismiss.next(name);
    }

    /**
     * Show the dismissed alert
     *
     * @param name
     */
    show(name: string): void
    {
        // Return if the name is not provided
        if ( !name )
        {
            return;
        }

        // Execute the observable
        this._onShow.next(name);
    }

    get fuseAlertData(): Observable<any>
    {
        return this._fuseAlertData.asObservable();
    }

    showAlert(name: string,type,alertTitle,message): void
    {
        // Return if the name is not provided
        if ( !name )
        {
            return;
        }
        const data ={
            type:type,
            message:message,
            alertTitle:alertTitle
        }

        // Execute the observable
        this._fuseAlertData.next(data);
        this._onShow.next(name);

    }

}
