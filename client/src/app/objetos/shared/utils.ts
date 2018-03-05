import { IObjeto } from './models/objeto.model';

export function objetoComparator(objeto1: any, objeto2: any): number {
    if (objeto1.order < objeto2.order) { return -1; }
    if (objeto1.order > objeto2.order) { return 1; }
    if (objeto1.order === objeto2.order) { return 0; }
}

export function objetoNumeroComparator(objeto1: IObjeto, objeto2: IObjeto): number {
    if (objeto1.numero < objeto2.numero) { return -1; }
    if (objeto1.numero > objeto2.numero) { return 1; }
    if (objeto1.numero === objeto2.numero) { return 0; }
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
export function occurrences(string: string, subString: string, allowOverlapping?: boolean): number {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

export function paddy(n: number|string, p: number, c?: string): string {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}