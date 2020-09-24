import { toggleMark } from 'prosemirror-commands';

import Mark from './mark';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }],
      toDOM() {
        return ['em'];
      }
    };
  }

  keyMap({ schema }) {
    return ['Mod-i', 'Mod-I'].reduce((keys, key) => {
      return {
        ...keys,
        ...{
          [`${key}`]: toggleMark(schema.marks.emph)
        }
      };
    }, {});
  }

  commands({ schema }) {
    return toggleMark(schema.marks.emph);
  }
}
