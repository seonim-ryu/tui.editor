import { toggleMark } from 'prosemirror-commands';

import Mark from './mark';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 's' }, { tag: 'strike' }],
      toDOM() {
        return ['strike'];
      }
    };
  }

  keyMap({ schema }) {
    return ['Mod-d', 'Mod-D'].reduce((keys, key) => {
      return {
        ...keys,
        ...{
          [`${key}`]: toggleMark(schema.marks.strike)
        }
      };
    }, {});
  }

  commands({ schema }) {
    return toggleMark(schema.marks.strike);
  }
}
