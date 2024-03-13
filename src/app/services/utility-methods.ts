export function copyObject(object: any): any {
  if (object || object === 0 || object === false) {
    return JSON.parse(JSON.stringify(object));
  } else {
    return null;
  }
}

export function hasId(array?: any[] | null, id?: string | null | number | boolean, usedIdKey?: string): boolean {
  let idKey: string = usedIdKey ?? 'id';
  let answer = false;
  if (array && !!array.length) {
    array.forEach((obj: any) => {
      if (obj && obj[idKey] && obj[idKey] === id) {
        answer = true;
      }
    });
  }
  return answer;
}

export function findId(array?: any[] | null, id?: string | number | null | boolean, getIndex?: boolean, usedIdKey?: string): any {
  let idKey: string = usedIdKey ?? 'id';
  let answer: any = null;
  if (array && !!array.length) {
    array.forEach((obj: any, index: number) => {
      if (obj && obj[idKey] && obj[idKey] === id) {
        if (getIndex) {
          answer = index;
        } else {
          answer = obj;
        }
      }
    });
  }
  return answer;
}

export function findIdAndDelete(array?: any[] | null, id?: string | null | number | boolean, usedIdKey?: string): boolean {
  let idKey: string = usedIdKey ?? 'id';
  let answer = false;
  if (array && !!array.length) {
    array.forEach((obj: any, index: number) => {
      if (obj && obj[idKey] && obj[idKey] === id) {
        answer = true;
        array.splice(index, 1);
      }
    });
  }
  return answer;
}

export function findIdAndReplace(array?: any[] | null, id?: string | number | null | boolean, newItem?: any, usedIdKey?: string): boolean {
  let idKey: string = usedIdKey ?? 'id';
  let answer = false;
  if (array && !!array.length) {
    array.forEach((obj: any, index: number) => {
      if (obj && obj[idKey] && obj[idKey] === id && newItem) {
        answer = true;
        array[index] = newItem;
      }
    });
  }
  return answer;
}

export function isDifferent(a: any, b: any) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

export function getStringBetweenStrings(startStr: string, endStr: string, str: string) {
  const pos: number = str.indexOf(startStr) + startStr.length;
  return str.substring(pos, str.indexOf(endStr, pos));
}
