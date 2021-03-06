import { Schema } from 'prosemirror-model';
import { basicSchema } from './basic';

const gfmSchema = {
  nodes: {
    item: {
      content: '(paragraph | codeBlock | bulletList | orderedList)*',
      group: 'block',
      attrs: {
        class: { default: null },
        task: { default: false },
        checked: { default: false }
      },
      defining: true,
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom) {
            return {
              class: dom.getAttribute('class'),
              task: dom.hasAttribute('data-task'),
              checked: !!dom.getAttribute('data-task-checked')
            };
          }
        }
      ],
      toDOM(node) {
        if (!node.attrs.task) {
          return ['li', 0];
        }

        const classNames = ['task-list-item'];

        if (node.attrs.checked) {
          classNames.push('checked');
        }

        return [
          'li',
          {
            class: classNames.join(' '),
            'data-task': node.attrs.task,
            'data-task-checked': node.attrs.checked
          },
          0
        ];
      }
    },

    table: {
      content: 'tableHead{1} tableBody+',
      group: 'block',
      parseDOM: [{ tag: 'table' }],
      toDOM() {
        return ['table', 0];
      }
    },

    tableHead: {
      content: 'tableRow{1}',
      parseDOM: [{ tag: 'thead' }],
      toDOM() {
        return ['thead', 0];
      }
    },

    tableBody: {
      content: 'tableRow+',
      attrs: {
        rows: { default: 1 },
        columns: { default: 1 }
      },
      parseDOM: [
        {
          tag: 'tbody',
          getAttrs(dom) {
            const rows = dom.querySelectorAll('tr');
            const [row] = rows;

            if (!row.children.length) {
              return false;
            }

            return {
              rows: rows.length,
              columns: row.children.length
            };
          }
        }
      ],
      toDOM() {
        return ['tbody', 0];
      }
    },

    tableRow: {
      content: '(tableHeadCell | tableBodyCell)+',
      attrs: { columns: { default: 1 } },
      parseDOM: [
        {
          tag: 'tr',
          getAttrs: dom => (dom.children.length ? { columns: dom.children.length } : false)
        }
      ],
      toDOM() {
        return ['tr', 0];
      }
    },

    tableHeadCell: {
      content: 'text*',
      parseDOM: [{ tag: 'th' }],
      toDOM() {
        return ['th', 0];
      }
    },

    tableBodyCell: {
      content: 'text*',
      parseDOM: [{ tag: 'td' }],
      toDOM() {
        return ['td', 0];
      }
    }
  },

  marks: {
    strike: {
      parseDOM: [{ tag: 's' }, { tag: 'strike' }],
      toDOM() {
        return ['strike'];
      }
    }
  }
};

export function createGfmSchema() {
  const { nodes: basicNodes, marks: basicMarks } = basicSchema;
  const { nodes: gfmNodes, marks: gfmMarks } = gfmSchema;
  const customSchema = {
    nodes: { ...basicNodes, ...gfmNodes },
    marks: { ...basicMarks, ...gfmMarks }
  };

  return new Schema(customSchema);
}
