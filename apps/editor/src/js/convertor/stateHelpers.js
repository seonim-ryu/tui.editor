function getAttrs(spec, node) {
  let attributes;

  if (spec.getAttrs) {
    attributes = spec.getAttrs(node);
  } else if (spec.attrs instanceof Function) {
    attributes = spec.attrs(node);
  } else {
    attributes = spec.attrs;
  }

  return attributes;
}

function getTextWithoutTrailingNewline(str) {
  return str[str.length - 1] === '\n' ? str.slice(0, str.length - 1) : str;
}

export function createNodeHandlers(schema, nodeTypes) {
  const handlers = {};

  Object.keys(nodeTypes).forEach(type => {
    const spec = nodeTypes[type];

    if (spec.block) {
      const nodeType = schema.nodeType(spec.block);

      if (spec.unclosedNode) {
        handlers[type] = (state, node) => {
          state.openNode(nodeType, getAttrs(spec, node));
          state.addText(getTextWithoutTrailingNewline(node.literal));
          state.closeNode();
        };
      } else {
        handlers[type] = (state, node, { entering }) => {
          if (entering) {
            state.openNode(nodeType, getAttrs(spec, node));
          } else {
            state.closeNode();
          }
        };
      }
    } else if (spec.node) {
      const nodeType = schema.nodeType(spec.node);

      handlers[type] = (state, node, { entering, skipChildren }) => {
        if (spec.skipChilren && entering) {
          skipChildren();
        }

        state.addNode(nodeType, getAttrs(spec, node));
      };
    } else if (spec.mark) {
      const markType = schema.marks[spec.mark];

      if (spec.unclosedNode) {
        handlers[type] = (state, node) => {
          state.openMark(markType.create(getAttrs(spec, node)));
          state.addText(getTextWithoutTrailingNewline(node.literal));
          state.closeMark(markType);
        };
      } else {
        handlers[type] = (state, node, { entering }) => {
          if (entering) {
            state.openMark(markType.create(getAttrs(spec, node)));
          } else {
            state.closeMark(markType);
          }
        };
      }
    }
  });

  handlers.text = (state, node) => state.addText(node.literal);
  handlers.inline = (state, node) => state.convertNodes(node);
  handlers.softbreak = handlers.softbreak || (state => state.addText('\n'));

  return handlers;
}

export function backticksFor(node, side) {
  const ticks = /`+/g;
  let len = 0;

  if (node.isText) {
    let m = ticks.exec(node.text);

    while (m) {
      len = Math.max(len, m[0].length);
      m = ticks.exec(node.text);
    }
  }

  let result = len > 0 && side > 0 ? ' `' : '`';

  for (let i = 0; i < len; i += 1) {
    result += '`';
  }

  if (len > 0 && side < 0) {
    result += ' ';
  }

  return result;
}

export function isPlainURL(link, parent, index, side) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) {
    return false;
  }

  const content = parent.child(index + (side < 0 ? -1 : 0));

  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  ) {
    return false;
  }

  if (index === (side < 0 ? 1 : parent.childCount - 1)) {
    return true;
  }

  const next = parent.child(index + (side < 0 ? -2 : 1));

  return !link.isInSet(next.marks);
}
