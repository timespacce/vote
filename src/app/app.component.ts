import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { MatSnackBar, MatCheckboxChange } from '@angular/material';
import { MatStepper } from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app'

  @ViewChild('progressBar') progressBar: any;

  isLinear = true
  credentialForm: FormGroup
  voteForm: FormGroup

  code
  selected
  accepted
  preferenced
  

  show = false

  selectOptions = ["Да", "Не знам / Не ми се идва"]
  preferenceOptions = [
    { value: 'EAT_AND_DRINK', viewValue: "Някъде да ядем и пием :)"},
    { value: 'DISCO', viewValue: "Опция 1) и mоже диско?"},
    { value: 'I_DONT_CARE', viewValue: "? ? ? se mi e taa"}
  ]

  LOCAL_URL: string = "http://localhost:8080/"

  REMOTE_URL: string = "https://boiling-plateau-33382.herokuapp.com/"

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit() {
    this.credentialForm = this._formBuilder.group({
      'credentialCtrl': ['', Validators.pattern('([A-Z][0-9]){2}')]
    })
    this.voteForm = this._formBuilder.group({
      'voteCtrl': new FormControl(null, [Validators.required]),
      'preferenceCtrl': new FormControl(null, [Validators.required])
    })
  }

  openSnackBarOnCredentials() {
    let credentialValid = this.credentialForm.get('credentialCtrl').valid
    if (credentialValid) {
      this._snackBar.open('Successful', '', { duration: 1000 })
      this.code = this.credentialForm.get('credentialCtrl').value
    } else {
      this._snackBar.open('Вашият vote code не е валиден', '', { duration: 1000 })
    }
  }

  openSnackBarOnVote() {
    let voteValid = this.voteForm.get('voteCtrl').valid
    let preferenceValid = this.voteForm.get('preferenceCtrl').valid
    if ((this.selected == 0 && preferenceValid) || this.selected == 1) {
      this._snackBar.open('Successful', '', { duration: 1000 })
      this.accepted = this.selected == 0
      this.showResult(this.code, this.accepted)
    } else if (voteValid == false){
      this._snackBar.open('Моля изберете опция', '', { duration: 1000 })
    } else {
      this._snackBar.open('Моля изберете опция', '', { duration: 1000 })
    }
  }

  showResult(code: string, selected: number) {
    this.show = true

    let body = {
      sender: this.code,
      accepted: this.accepted,
      preferences: this.accepted ? [this.preferenced] : []
    }

     

    this.http
      .post(this.REMOTE_URL + "count", body)
      .subscribe(data => {
        this.show = false
      })
  }

  toggleSelect(event: MatCheckboxChange, i) {
    if (this.selected == 1 && i == 0) {
      this.voteForm.get('preferenceCtrl').setValue(undefined)
    }

    this.selected = event.checked ? i : undefined

    if (this.selected == 1) {
      this.voteForm.get('preferenceCtrl').setValue('I_DONT_CARE')
    }
  }
}
