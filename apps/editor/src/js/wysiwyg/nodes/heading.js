import { setBlockType } from 'prosemirror-commands';

import Node from './node';

export class Heading extends Node {
  get name() {
    return 'heading';
  }

  get levels() {
    return [1, 2, 3, 4, 5, 6];
  }

  get schema() {
    const parseDOM = this.levels.map(level => {
      return { tag: `h${level}`, attrs: { level } };
    });

    return {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM,
      toDOM(node) {
        return [`h${node.attrs.level}`, 0];
      }
    };
  }

  keyMap({ schema }) {
    const nodeType = schema.nodes.heading;

    return this.levels.reduce((keys, level) => {
      return {
        ...keys,
        ...{
          [`Shift-Ctrl-${level}`]: setBlockType(nodeType, { level })
        }
      };
    }, {});
  }

  commands({ schema }) {
    return attrs => setBlockType(schema.nodes.heading, attrs);
  }
}
