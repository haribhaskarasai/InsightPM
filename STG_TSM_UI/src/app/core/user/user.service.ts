import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap, BehaviorSubject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment.local';
import CryptoJS from 'crypto-js';
import { API } from 'app/common/api-constants/api-constants';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    key = "123";
    private _user: BehaviorSubject<any> = new BehaviorSubject<any>(1);
    private baseUrl = environment.GLOBAL_URL;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: any) {
        // Store the value
        //this._user.next(value);
        let data = localStorage.getItem('currentUser')|| "";
        if(data == ""){
            localStorage.setItem('currentUser',this.encrypt(JSON.stringify(value)));
        }
        this._user.next(value);
        
    }

    get user$(): any {
        let data = localStorage.getItem('currentUser')|| "";
        if(data !== ""){
            this.user =  JSON.parse(this.decrypt(data));
        }
        return this._user.asObservable();
    }

    private encrypt(value: any): any {
        return CryptoJS.AES.encrypt(value, this.key);
    }

    private decrypt(value: any) {
        return CryptoJS.AES.decrypt(value, this.key).toString(CryptoJS.enc.Utf8);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
