import { setBlockType } from 'prosemirror-commands';

import Node from './node';

export class Heading extends Node {
  get name() {
    return 'heading';
  }

  get schema() {
    return {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } }
      ],
      toDOM(node) {
        return [`h${node.attrs.level}`, 0];
      }
    };
  }

  keyMap(context, commands) {
    const keyMap = {};

    for (let level = 1; level <= 6; level += 1) {
      keyMap[`Shift-Ctrl-${level}`] = commands(context, { level });
    }

    return keyMap;
  }

  commands({ schema }, attrs) {
    const nodeType = schema.nodes.heading;

    return setBlockType(nodeType, attrs);
  }
}
