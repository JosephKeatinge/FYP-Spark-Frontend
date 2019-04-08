import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-command-bar',
  template: `
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="basic-addon1">=</span>
    </div>
    <input #cmd type="text" class="form-control" placeholder="CMD(COLS)">
    <button class="btn btn-primary" type="submit" (click)=onClickCmd(cmd.value)>Execute</button>
  </div>
    `
})
export class CommandBarComponent implements OnInit {
  /*
  * Component associated with the user input box which is located in the app component's navbar
  */
  errorMsg = '';
  commandOpts = [
    'MIN', 'MAX', 'AVG', 'SUM', 'COUNT', 'SELECT', 'GRAPH'
  ];

  @Output() commandEntered = new EventEmitter();

  constructor(
    ) { }

  ngOnInit() {
  }

  onClickCmd(cmd: string) {
    // Called when the user clicks the execute button. The command is parsed into an object,
    // and this is emitted as an event to the parent component.
    const parsedCmd = this.parseCommand(cmd);
    this.commandEntered.emit(parsedCmd);
  }

  parseCommand(command: string): {operation: string, range: Array<string>, columns: string} {
    let op: string;
    let range: Array<string>;
    let col = '';
    for (let i = 0; i < this.commandOpts.length; i++) {
      const matchExp = new RegExp(this.commandOpts[i]);
      if (command.match(matchExp)) {
        op = this.commandOpts[i];
        command = command.replace(matchExp, '');
        break;
      }
    }
    const colExp = new RegExp(/[A-Z]+/g);
    const matchedLetters = command.match(colExp);
    if (matchedLetters) {
      matchedLetters.forEach(function(element) {
        col += element;
      });
    } else {
      col = '*';
      console.log('Cols = ' + col);
    }
    const rangeExp = new RegExp(/\d+/g);
    const matchedNum = command.match(rangeExp);
    if (matchedNum) {
       range = matchedNum;
    } else {
      range = [];
    }

    return {operation: op, columns: col, range: range};
  }
}

