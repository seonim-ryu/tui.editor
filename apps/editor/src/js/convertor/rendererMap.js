import { backticksFor, isPlainURL } from './stateHelpers';

export const nodes = {
  paragraph(state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },

  heading(state, node) {
    state.write(`${state.repeat('#', node.attrs.level)} `);
    state.renderInline(node);
    state.closeBlock(node);
  },

  codeBlock(state, node) {
    state.write(`\`\`\`${node.attrs.params || ''}\n`);
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('```');
    state.closeBlock(node);
  },

  bulletList(state, node) {
    state.renderList(node, '  ', () => `${node.attrs.bullet || '*'} `);
  },

  orderedList(state, node) {
    const start = node.attrs.order || 1;
    const maxW = String(start + node.childCount - 1).length;
    const space = state.repeat(' ', maxW + 2);

    state.renderList(node, space, i => {
      const nStr = String(start + i);

      return `${state.repeat(' ', maxW - nStr.length)}${nStr}. `;
    });
  },

  item(state, node) {
    const { task, checked } = node.attrs;

    if (task) {
      const marker = `[${checked ? 'x' : ' '}] `;

      state.wrapBlock(marker, null, node, () => state.renderContent(node));
    } else {
      state.renderContent(node);
    }
  },

  table(state, node) {
    state.renderContent(node);
    state.closeBlock(node);
  },

  tableHead(state, node) {
    const row = node.firstChild;
    let result = '';

    state.renderContent(node);

    for (let i = 0, len = row.childCount; i < len; i += 1) {
      const { textContent } = row.child(i);

      result += `| ${state.repeat('-', textContent.length)} `;
    }

    state.write(`${result}|\n`);
  },

  tableBody(state, node) {
    state.renderContent(node);
  },

  tableRow(state, node) {
    state.renderContent(node);
    state.write('| \n');
  },

  tableHeadCell(state, node) {
    state.write('| ');
    state.renderInline(node);
    state.write(' ');
  },

  tableBodyCell(state, node) {
    state.write('| ');
    state.renderInline(node);
    state.write(' ');
  },

  blockQuote(state, node) {
    state.wrapBlock('> ', null, node, () => state.renderContent(node));
  },

  thematicBreak(state, node) {
    state.write(node.attrs.markup || '---');
    state.closeBlock(node);
  },

  image(state, node) {
    const alt = state.esc(node.attrs.alt || '');
    const src = state.esc(node.attrs.src);
    const title = node.attrs.title ? ` ${state.quote(node.attrs.title)}` : '';

    state.write(`![${alt}](${src}${title})`);
  },

  hardBreak(state, node, parent, index) {
    for (let i = index + 1; i < parent.childCount; i += 1)
      if (parent.child(i).type !== node.type) {
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
      const href = state.esc(mark.attrs.href);
      const title = mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : '';

      return isPlainURL(mark, parent, index, -1) ? '>' : `](${href}${title})`;
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
