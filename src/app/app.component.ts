import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app'

  isLinear = true
  credentialForm: FormGroup
  voteForm: FormGroup

  code
  selected
  accepted

  show = false

  selectOptions = ["I'll come", "Sorry, i can't"]

  LOCAL_URL: string = "http://localhost:8080/"

  REMOTE_URL: string = "https://boiling-plateau-33382.herokuapp.com/"

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit() {
    this.credentialForm = this._formBuilder.group({
      'credentialCtrl': ['', Validators.pattern('([A-Z][0-9]){2}')]
    })
    this.voteForm = this._formBuilder.group({
      'voteCtrl': ['', Validators.required]
    })
  }

  openSnackBarOnCredentials(controller: string) {
    let credentialValid = this.credentialForm.get('credentialCtrl').valid
    if (credentialValid) {
      this._snackBar.open('Successful', '', { duration: 1000 })
      this.code = this.credentialForm.get('credentialCtrl').value
    } else {
      this._snackBar.open('Your vote code is not valid', '', { duration: 1000 })
    }
  }

  openSnackBarOnVote(controller: string) {
    let voteValid = this.voteForm.get('voteCtrl').valid
    if (voteValid) {
      this._snackBar.open('Successful', '', { duration: 1000 })
      this.accepted = this.selected == 0
      this.showResult(this.code, this.accepted)
    } else {
      this._snackBar.open('Please select an option', '', { duration: 1000 })
    }
  }

  showResult(code: string, selected: number) {
    console.info(this.code, this.accepted)

    let body = {
      sender: this.code,
      accepted: this.accepted
    }

    this.http
      .post(this.REMOTE_URL + "count", body)
      .subscribe(data => {
        console.info(data)
        this.show = true
      })
  }

}
