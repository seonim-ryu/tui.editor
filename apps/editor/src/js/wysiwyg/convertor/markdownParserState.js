import { Mark } from 'prosemirror-model';

const NO_PAIR_NODE = /thematicBreak|codeBlock|text|inline|softbreak|image|code/;

function maybeMerge(a, b) {
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
    return a.withText(a.text + b.text);
  }

  return false;
}

export default class MarkdownParseState {
  constructor(schema, tokenHandlers) {
    this.schema = schema;
    this.stack = [{ type: schema.topNodeType, content: [] }];
    this.marks = Mark.none;
    this.tokenHandlers = tokenHandlers;
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  push(elt) {
    if (this.stack.length) {
      this.top().content.push(elt);
    }
  }

  addText(text) {
    if (text) {
      const nodes = this.top().content;
      const last = nodes[nodes.length - 1];
      const node = this.schema.text(text, this.marks);
      const merged = last && maybeMerge(last, node);

      if (merged) {
        nodes[nodes.length - 1] = merged;
      } else {
        nodes.push(node);
      }
    }
  }

  openMark(mark) {
    this.marks = mark.addToSet(this.marks);
  }

  closeMark(mark) {
    this.marks = mark.removeFromSet(this.marks);
  }

  addNode(type, attrs, content) {
    const node = type.createAndFill(attrs, content, this.marks);

    if (node) {
      this.push(node);

      return node;
    }

    return null;
  }

  openNode(type, attrs) {
    this.stack.push({ type, attrs, content: [] });
  }

  closeNode() {
    if (this.marks.length) {
      this.marks = Mark.none;
    }

    const { type, attrs, content } = this.stack.pop();

    return this.addNode(type, attrs, content);
  }

  parseNodes(mdNode) {
    const walker = mdNode.walker();
    let event = walker.next();

    while (event) {
      const { node, entering } = event;
      let { type } = node;

      if (type === 'list') {
        const { listData } = node;

        type = `${listData.type}List`;
      } else if (type === 'tableCell') {
        const parentType = node.parent.parent && node.parent.parent.type;

        if (parentType === 'tableHead' || parentType === 'tableBody') {
          type = `${parentType}Cell`;
        }
      }

      if (!NO_PAIR_NODE.test(type)) {
        if (entering) {
          type = `${type}Open`;
        } else {
          type = `${type}Close`;
        }
      }

      const closeImage = type === 'image' && !entering;
      const imageText = type === 'text' && node.parent.type === 'image';

      const handler = this.tokenHandlers[type];

      if (!closeImage && !imageText && handler) {
        handler(this, node);
      }

      event = walker.next();
    }
  }
}
