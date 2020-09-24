import { toggleMark } from 'prosemirror-commands';

import Mark from './mark';

export class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'b' }, { tag: 'strong' }],
      toDOM() {
        return ['strong'];
      }
    };
  }

  keyMap({ schema }) {
    return ['Mod-b', 'Mod-B'].reduce((keys, key) => {
      return {
        ...keys,
        ...{
          [`${key}`]: toggleMark(schema.marks.strong)
        }
      };
    }, {});
  }

  commands({ schema }) {
    return toggleMark(schema.marks.strong);
  }
}
