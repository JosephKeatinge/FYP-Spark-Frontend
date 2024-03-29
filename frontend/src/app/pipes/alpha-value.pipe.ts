import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphaValue'
})
export class AlphaValuePipe implements PipeTransform {
  /*
  * Custom pipe to print the letter corresponding to the number entered.
  * i.e. 1 == A, 2 == B, etc.
  */
  alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  transform(index: number): string {
    if (Math.floor(index / this.alphabet.length - 1) > 0) {
      let alpha = '';
      alpha += this.alphabet[Math.floor(index / (this.alphabet.length - 1))];
      alpha += this.alphabet[index];
      return alpha;
    } else {
      return this.alphabet[index];
    }
  }

}
