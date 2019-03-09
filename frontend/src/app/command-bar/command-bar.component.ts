import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-command-bar',
  template: `
    <input #cmd>
    <button (click)=onClickCmd(cmd.value)>Execute</button>
    `
})
export class CommandBarComponent implements OnInit {
  userCmd: string;

  constructor() { }

  ngOnInit() {
  }

  onClickCmd(cmd: string) {
    this.userCmd = cmd;
  }
}
