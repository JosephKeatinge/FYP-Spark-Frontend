import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';

@Component({
  selector: 'app-command-bar',
  template: `
    <input #cmd>
    <button (click)=onClickCmd(cmd.value)>Execute</button> <br>
    <h3>{{errorMsg}}<h3>
    `
})
export class CommandBarComponent implements OnInit {
  userCmd: string;
  errorMsg = '';

  constructor(
    private router: Router,
    private globals: Globals
    ) { }

  ngOnInit() {
  }

  onClickCmd(cmd: string) {
    this.userCmd = cmd;
    if (this.globals.currentDS) {
      this.router.navigate(
        ['/dataset', this.globals.currentDS.id],
        {queryParams: {operation: this.userCmd}}
        );
    } else {
      this.errorMsg = 'Please select a dataset';
    }
  }
}
