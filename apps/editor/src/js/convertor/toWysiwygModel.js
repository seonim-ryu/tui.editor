import MarkdownParseState from './wysiwygModelConvertorState';
import { nodeMap } from './nodeMap';

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
function isUnclosedNode(spec, type) {
  return spec.unclosedNode || type === 'code' || type === 'codeBlock';
}

function isSkipChildrenNode(spec, type) {
  return spec.skipChilren || type === 'image';
}

function getTextWithoutTrailingNewline(str) {
  return str[str.length - 1] === '\n' ? str.slice(0, str.length - 1) : str;
}

function createNodeHandlers(schema, nodeTypes) {
  const handlers = {};

  Object.keys(nodeTypes).forEach(type => {
    const spec = nodeTypes[type];

    if (spec.block) {
      const nodeType = schema.nodeType(spec.block);

      if (isUnclosedNode(spec, type)) {
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
        if (isSkipChildrenNode(spec, type) && entering) {
          skipChildren();
        }

        state.addNode(nodeType, getAttrs(spec, node));
      };
    } else if (spec.mark) {
      const markType = schema.marks[spec.mark];

      if (isUnclosedNode(spec, type)) {
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

export function convertMdNodeToDoc(schema, mdNode) {
  const handlers = createNodeHandlers(schema, nodeMap);
  const state = new MarkdownParseState(schema, handlers);

  state.convertNodes(mdNode);

  let doc;

  do {
    doc = state.closeNode();
  } while (state.stack.length);

  return doc;
}
