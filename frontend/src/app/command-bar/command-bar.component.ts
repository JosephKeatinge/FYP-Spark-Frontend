import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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

  parseCommand(command: string) {
    let operation = '';
    let range = [];
    for (let i = 0; i < this.commandOpts.length; i++) {
      const matchExp = new RegExp(this.commandOpts[i]);
      if (command.match(matchExp)) {
        operation = this.commandOpts[i];
      }
    }
    const rangeExp = new RegExp(/[A-Z]+\d*/g);
    const matchedItems = command.split('(')[1].match(rangeExp);
    if (matchedItems.length > 0) {
      console.log('Match: ' + matchedItems);
    }
  }
}

