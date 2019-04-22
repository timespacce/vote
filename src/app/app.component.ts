import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { MatSnackBar, MatCheckboxChange } from '@angular/material';
import { MatStepper } from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http'
import { Opinion } from '../model/opinion';
import { Preference } from '../model/preference';

import app_configuration from '../assets/app_configuration.json';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /// meta
  title = 'app'

  @ViewChild('stepper') stepper: MatStepper;

  /// access to enums in html only via variable
  opinions = Opinion
  preferences = Preference
  vote_app

  isLinear = true
  credentialForm: FormGroup
  voteForm: FormGroup

  /// used
  code: string = ""
  opinion: Opinion = Opinion.UNDEFINED
  preference: Preference = Preference.UNDEFINED

  sent: boolean = true

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit() {
    /// initialize application configuration
    this.vote_app = app_configuration
    /// set sign in code
    this.credentialForm = this._formBuilder.group({
      'credentialCtrl': ['', Validators.pattern('([A-Z][0-9]){2}')]
    })
    /// set required input fields
    this.voteForm = this._formBuilder.group({
      'opinionCtrl': new FormControl(null, [Validators.required]),
      'preferenceCtrl': new FormControl(null, [Validators.required]),
      'submitCtrl': new FormControl(null, [Validators.required])
    })
  }

  openSnackBarOnClick(valid: boolean, success: string, error: string) {
    console.info(valid, success, error)
    if (valid) {
      this._snackBar.open(success, '', { duration: 1000 })
    } else {
      this._snackBar.open(error, '', { duration: 1000 })
    }
  }

  openSnackBarOnVote() {
    let accept: boolean = this.opinion == Opinion.YES && this.preference != Preference.UNDEFINED
    let declined: boolean = this.opinion == Opinion.NO && this.preference == Preference.UNDEFINED

    if (accept || declined) {
      this._snackBar.open(this.vote_app.vote_app.vote_snackbar_answers.success, '', { duration: 1000 })
      this.voteForm.get("submitCtrl").setValue(true)
      this.stepper.next()
      this.showResult()
    } else {
      this._snackBar.open(this.vote_app.vote_app.vote_snackbar_answers.error, '', { duration: 1000 })
    }
  }

  showResult() {
    /// show notification
    this.sent = false

    /// data
    let body = {
      sender: this.code,
      opinion: this.opinion,
      preferences: [this.preference]
    }

    /// sent to backend and on success stop the notification
    this.http
      .post(this.vote_app.spring_backend.BACKEND_URL + "count", body)
      .subscribe(data => {
        /// stop notification
        this.sent = true
        /// disable forward header navigation
        this.voteForm.get("submitCtrl").reset()
      })
  }

  toggleSelect(event: MatCheckboxChange, value: Opinion) {
    /// none
    if (event.checked == false) {
        this.opinion = Opinion.UNDEFINED
        this.preference = Preference.UNDEFINED
        this.voteForm.get("opinionCtrl").reset()
        this.voteForm.get("preferenceCtrl").reset()
        return
    }

    /// yes
    if (value == Opinion.YES) {
      this.opinion = value
      return
    }

    /// no
    if (value == Opinion.NO) {
      this.opinion = value
      this.preference = Preference.UNDEFINED
      this.voteForm.get("preferenceCtrl").setValue(this.preference)
    }
  }
}
