import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { stringify } from 'querystring';

@Component({
  selector: 'app-command-bar',
  template: `
    <input #cmd>
    <button (click)=onClickCmd(cmd.value)>Execute</button>
    `
})
export class CommandBarComponent implements OnInit {
  errorMsg = '';
  commandOpts = [
    'MIN', 'MAX', 'AVG', 'SUM'
  ];

  @Output() commandEntered = new EventEmitter();

  constructor(
    ) { }

  ngOnInit() {
  }

  onClickCmd(cmd: string) {
    this.parseCommand(cmd);
    this.commandEntered.emit(cmd);
  }

  parseCommand(command: string): {operation: string, range: Array<string>} {
    let op: string;
    let range: Array<string>;
    for (let i = 0; i < this.commandOpts.length; i++) {
      const matchExp = new RegExp(this.commandOpts[i]);
      if (command.match(matchExp)) {
        op = this.commandOpts[i];
        command = command.replace(matchExp, '');
        break;
      }
    }
    const rangeExp = new RegExp(/[A-Z]+\d*/g);
    const matchedItems = command.match(rangeExp);
    if (matchedItems.length > 0) {
      range = matchedItems;
    }

    return {operation: op, range: range};
  }
}

