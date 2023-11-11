export default function splitStringNew(str, n, useWordBoundary = true) {
  if (str.length <= n) {
    return str;
  } else {
    const subString = str.substr(0, n - 1);
    return subString + '...';
  }
}

export const COUNTNOTREAD = 'COUNTNOTREAD';
export const MAILIDROOT = 'MAILIDROOT';
export const MAILREFESH = 'MAILREFESH';
export const TYPEMAIL = 'TYPEMAIL';
export const EMAILIDOPEN = 'EMAILIDOPEN';
