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

  get keyMap() {
    return 'Mod-b';
  }

  commands({ schema }) {
    const nodeType = schema.marks.strong;

    return toggleMark(nodeType);
  }
}
