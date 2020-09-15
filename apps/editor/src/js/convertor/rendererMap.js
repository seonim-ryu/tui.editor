/* eslint-disable */
import { backticksFor, isPlainURL } from './stateHelpers';

export const nodes = {
  paragraph(state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },

  heading(state, node) {
    state.write(state.repeat('#', node.attrs.level) + ' ');
    state.renderInline(node);
    state.closeBlock(node);
  },

  codeBlock(state, node) {
    state.write('```' + (node.attrs.params || '') + '\n');
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('```');
    state.closeBlock(node);
  },

  bulletList(state, node) {
    state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
  },

  blockQuote(state, node) {
    state.wrapBlock('> ', null, node, () => state.renderContent(node));
  },

  orderedList(state, node) {
    let start = node.attrs.order || 1;
    let maxW = String(start + node.childCount - 1).length;
    let space = state.repeat(' ', maxW + 2);
    state.renderList(node, space, i => {
      let nStr = String(start + i);
      return state.repeat(' ', maxW - nStr.length) + nStr + '. ';
    });
  },

  item(state, node) {
    state.renderContent(node);
  },

  thematicBreak(state, node) {
    state.write(node.attrs.markup || '---');
    state.closeBlock(node);
  },

  image(state, node) {
    state.write(
      '![' +
        state.esc(node.attrs.alt || '') +
        '](' +
        state.esc(node.attrs.src) +
        (node.attrs.title ? ' ' + state.quote(node.attrs.title) : '') +
        ')'
    );
  },

  hardBreak(state, node, parent, index) {
    for (let i = index + 1; i < parent.childCount; i++)
      if (parent.child(i).type != node.type) {
        state.write('\\\n');
        return;
      }
  },

  text(state, node) {
    state.text(node.text);
  }
};

export const marks = {
  strong: { open: '**', close: '**', mixable: true, expelEnclosingWhitespace: true },

  emph: { open: '*', close: '*', mixable: true, expelEnclosingWhitespace: true },

  strike: { open: '~~', close: '~~', mixable: true, expelEnclosingWhitespace: true },

  link: {
    open(_state, mark, parent, index) {
      return isPlainURL(mark, parent, index, 1) ? '<' : '[';
    },
    close(state, mark, parent, index) {
      return isPlainURL(mark, parent, index, -1)
        ? '>'
        : '](' +
            state.esc(mark.attrs.href) +
            (mark.attrs.title ? ' ' + state.quote(mark.attrs.title) : '') +
            ')';
    }
  },

  code: {
    open(_state, _mark, parent, index) {
      return backticksFor(parent.child(index), -1);
    },
    close(_state, _mark, parent, index) {
      return backticksFor(parent.child(index - 1), 1);
    },
    escape: false
  }
};
