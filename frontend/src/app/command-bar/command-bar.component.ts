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

  @Output() commandEntered = new EventEmitter();

  constructor(
    ) { }

  ngOnInit() {
  }

  onClickCmd(cmd: string) {
    // const command = this.parseCommand(cmd);
    this.commandEntered.emit(cmd);
  }

  parseCommand(command: string): {operation: string, columns: Array<string>, range: number} {
    return {operation: '', columns: [], range: 0};
  }
}

