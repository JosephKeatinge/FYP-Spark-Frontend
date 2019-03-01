import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objkeys'})
export class ObjKeysPipe implements PipeTransform {
    transform(obj: Object): any {
        let keys = [];
        for (const key of obj) {
            keys.push(key);
        }
        return keys;
    }
}
