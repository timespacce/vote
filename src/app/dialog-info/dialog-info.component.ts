import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatCheckboxChange, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.css']
})
export class DialogInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogInfoComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
