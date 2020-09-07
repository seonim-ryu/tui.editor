import MarkdownParseState from './markdownParserState';

function attrs(spec, token) {
  let attributes;

  if (spec.getAttrs) {
    attributes = spec.getAttrs(token);
  } else if (spec.attrs instanceof Function) {
    attributes = spec.attrs(token);
  } else {
    attributes = spec.attrs;
  }

  return attributes;
}

function noCloseToken(spec, type) {
  return spec.noCloseToken || type === 'code_inline' || type === 'code_block' || type === 'fence';
}

function withoutTrailingNewline(str) {
  return str[str.length - 1] === '\n' ? str.slice(0, str.length - 1) : str;
}

function noOp() {}

function tokenHandlers(schema, tokens) {
  const handlers = {};

  Object.keys(tokens).forEach(type => {
    const spec = tokens[type];

    if (spec.block) {
      const nodeType = schema.nodeType(spec.block);

      if (noCloseToken(spec, type)) {
        handlers[type] = (state, tok) => {
          state.openNode(nodeType, attrs(spec, tok));
          state.addText(withoutTrailingNewline(tok.content));
          state.closeNode();
        };
      } else {
        handlers[`${type}_open`] = (state, tok) => {
          state.openNode(nodeType, attrs(spec, tok));
        };
        handlers[`${type}_close`] = state => state.closeNode();
      }
    } else if (spec.node) {
      const nodeType = schema.nodeType(spec.node);

      handlers[type] = (state, tok) => state.addNode(nodeType, attrs(spec, tok));
    } else if (spec.mark) {
      const markType = schema.marks[spec.mark];

      if (noCloseToken(spec, type)) {
        handlers[type] = (state, tok) => {
          state.openMark(markType.create(attrs(spec, tok)));
          state.addText(withoutTrailingNewline(tok.content));
          state.closeMark(markType);
        };
      } else {
        handlers[`${type}_open`] = (state, tok) =>
          state.openMark(markType.create(attrs(spec, tok)));
        handlers[`${type}_close`] = state => state.closeMark(markType);
      }
    } else if (spec.ignore) {
      if (noCloseToken(spec, type)) {
        handlers[type] = noOp;
      } else {
        handlers[`${type}_open`] = noOp;
        handlers[`${type}_close`] = noOp;
      }
    }
  });

  handlers.text = (state, tok) => state.addText(tok.literal);
  handlers.inline = (state, tok) => state.parseTokens(tok.children);
  handlers.softbreak = handlers.softbreak || (state => state.addText('\n'));

  return handlers;
}

const tokenMap = {
  paragraph: { block: 'paragraph' }
};

export function convertMdNodeToDoc(schema, mdNode) {
  const handlers = tokenHandlers(schema, tokenMap);

  // @TODO move to editor's convertor
  const state = new MarkdownParseState(schema, handlers);

  state.parseNodes(mdNode);

  let doc;

  do {
    doc = state.closeNode();
  } while (state.stack.length);

  return doc;
}
