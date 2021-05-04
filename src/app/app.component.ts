import {Component, ViewChild, ViewEncapsulation} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar'
import {MatCheckboxChange} from '@angular/material/checkbox'
import {MatDialog} from '@angular/material/dialog';
import {MatStepper} from "@angular/material/stepper";
import {HttpClient} from '@angular/common/http';
import {ANSWER} from '../model/ANSWER';
import {MEETING_PREFERENCE} from '../model/MEETING_PREFERENCE';
import {PARTICIPATION_FORM} from '../model/PARTICIPATION_FORM';

import {DialogInfoComponent} from './dialog-info/dialog-info.component';

import app_configuration from '../assets/app_configuration.json';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  /// meta
  title = 'app'

  @ViewChild('stepper') stepper: MatStepper;

  /// access to enums in html only via variable
  answers = ANSWER
  meeting_preferences = MEETING_PREFERENCE
  participation_forms = PARTICIPATION_FORM
  isLinear = true

  vote_app = undefined
  credentialForm: FormGroup
  voteForm: FormGroup

  /// used
  code: string = ""
  opinion: ANSWER = ANSWER.UNDEFINED
  meeting_preference: MEETING_PREFERENCE = MEETING_PREFERENCE.UNDEFINED
  participation_form: PARTICIPATION_FORM = PARTICIPATION_FORM.UNDEFINED
  selected_days_list = []
  selected_days = ""

  meeting_date_filter = (d: Date | null): boolean => {
    const time = (d || new Date())
    const day = time.getDate();
    const month = time.getMonth()
    return month == 4 && day >= 12 && day <= 15;
  }

  sent: boolean = true

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private http: HttpClient, public dialog: MatDialog, private datePipe: DatePipe) {
  }

  ngOnInit() {
    /// initialize application configuration
    this.vote_app = app_configuration
    /// set sign in code
    this.credentialForm = this._formBuilder.group({
      'credential_controller': ['', Validators.pattern('([A-Z][0-9]){2}')]
    })
    /// set required input fields
    this.voteForm = this._formBuilder.group({
      'answer_controller': new FormControl(null, [Validators.required]),
      'meeting_preference_controller': new FormControl(null, [Validators.required]),
      'participation_form_controller': new FormControl(null, [Validators.required]),
      'meeting_date_controller': new FormControl(null, [Validators.required]),
      'submitCtrl': new FormControl(null, [Validators.required])
    })
  }

  openSnackBarOnClick(valid: boolean, success: string, error: string) {
    if (valid) {
      this._snackBar.open(success, '', {duration: 1000})
    } else {
      this._snackBar.open(error, '', {duration: 1000})
    }
  }

  isSelected = (event: any) => {
    const date = this.datePipe.transform(event, 'yyyy-MM-dd');
    return this.selected_days_list.find(x => x == date) ? "selected" : null;
  };

  select(event: any, calendar: any) {
    const date = this.datePipe.transform(event, 'yyyy-MM-dd');
    const index = this.selected_days_list.findIndex(x => x == date);
    if (index < 0) this.selected_days_list.push(date);
    else this.selected_days_list.splice(index, 1);
    calendar.updateTodaysDate();
    this.selected_days = this.selected_days_list.join(', ')
    this.voteForm.controls['meeting_date_controller'].setValue(this.selected_days_list)
    this.scroll_to_bottom()
  }

  scroll_to_bottom() {
    setTimeout(x => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 200);
  }

  has_voted() {
    let voted = this.meeting_preference != MEETING_PREFERENCE.UNDEFINED && this.participation_form != PARTICIPATION_FORM.UNDEFINED && this.selected_days_list.length > 0
    let not_voted = this.meeting_preference == MEETING_PREFERENCE.UNDEFINED && this.participation_form == PARTICIPATION_FORM.UNDEFINED && this.selected_days_list.length == 0

    let accept: boolean = this.opinion == ANSWER.YES && voted
    let declined: boolean = this.opinion == ANSWER.NO && not_voted

    return accept || declined
  }

  openSnackBarOnVote() {
    let voted = this.has_voted()

    if (voted) {
      this._snackBar.open(this.vote_app.vote_app.vote_snackbar_answers.success, '', {duration: 1000})
      this.stepper.selected.completed = true;
      this.stepper.next()
      this.showResult()
    } else {
      this._snackBar.open(this.vote_app.vote_app.vote_snackbar_answers.error, '', {duration: 1000})
    }
  }

  showResult() {
    /// show notification
    this.sent = false

    /// data
    let body = {
      sender: this.code,
      answer: this.opinion,
      meeting_preferences: [this.meeting_preference],
      participation_form: this.participation_form,
      selected_days: this.selected_days_list
    }

    /// sent to backend and on success stop the notification
    this.http
      .post(this.vote_app.spring_backend.BACKEND_URL + "vote", body)
      .subscribe(data => {
        /// stop notification
        this.sent = true
        /// disable forward header navigation
        this.voteForm.get("submitCtrl").reset()
      })
  }

  toggleSelect(event: MatCheckboxChange, value: ANSWER) {
    /// none
    if (event.checked == false) {
      this.opinion = ANSWER.UNDEFINED
      this.meeting_preference = MEETING_PREFERENCE.UNDEFINED
      this.participation_form = PARTICIPATION_FORM.UNDEFINED
      this.selected_days_list = []
      this.voteForm.get("answer_controller").reset()
      this.voteForm.get("meeting_preference_controller").reset()
      this.voteForm.get("participation_form_controller").reset()
      this.voteForm.get("meeting_date_controller").reset()
      return
    }

    /// yes
    if (value == ANSWER.YES) {
      this.opinion = value
      return
    }

    /// no
    if (value == ANSWER.NO) {
      this.opinion = value
      this.meeting_preference = MEETING_PREFERENCE.UNDEFINED
      this.participation_form = PARTICIPATION_FORM.UNDEFINED
      this.selected_days_list = []
      this.voteForm.get("meeting_preference_controller").setValue(this.meeting_preference)
      this.voteForm.get("participation_form_controller").setValue(this.participation_form)
      this.voteForm.get("meeting_date_controller").setValue(this.selected_days_list)
    }
  }

  showInfo() {
    const dialogRef = this.dialog.open(DialogInfoComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.vote_app.vote_app.info_badge_count -= 1
      this.vote_app.vote_app.info_badge_hidden = true
    });
  }
}
