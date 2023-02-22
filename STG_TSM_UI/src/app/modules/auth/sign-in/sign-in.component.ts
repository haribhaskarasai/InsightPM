import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ConversionUtils } from 'turbocommons-ts';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private cookieService: CookieService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [''],
            password: ['',],
            rememberMe: ['']
        });
        
        if (this.cookieService.get('remember') !== undefined) {
            if (this.cookieService.get('remember') === "Yes") {
                this.signInForm = this._formBuilder.group({
                    email: [ConversionUtils.base64ToString(this.cookieService.get('userEmail')), [Validators.required, Validators.email]],
                    password: [ConversionUtils.base64ToString(this.cookieService.get('password')), Validators.required],
                    rememberMe: ['']
                });
            }
        }
           
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.value.email.includes("@") && this.signInForm.value.password.length>=8) {
            
        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {

                    if (this.signInForm.value.rememberMe) {
                        this.cookieService.set('remember', "Yes");
                        this.cookieService.set('userEmail',ConversionUtils.stringToBase64(this.signInForm.value.email));
                        this.cookieService.set('password', ConversionUtils.stringToBase64(this.signInForm.value.password));
                    } else {
                        this.cookieService.set('remember', "No");
                        this.cookieService.set('userEmail', "");
                        this.cookieService.set('password', "");
                    }
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
        }else{
            this.alert = {
                type: 'error',
                message: 'Please enter correct username and password'
            };

            // Show the alert
            this.showAlert = true;
        }

    }
}
