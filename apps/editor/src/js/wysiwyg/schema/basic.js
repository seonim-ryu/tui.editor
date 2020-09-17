import { Schema } from 'prosemirror-model';

export const basicSchema = {
  nodes: {
    codeBlock: {
      content: 'text*',
      group: 'block',
      attrs: {
        class: { default: null },
        language: { default: null }
      },
      code: true,
      defining: true,
      marks: '',
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full',
          getAttrs(dom) {
            const className = dom.getAttribute('class');
            const language = className.split('lang-');

            return {
              class: className,
              language
            };
          }
        }
      ],
      toDOM(node) {
        return [
          'pre',
          { class: node.attrs.class || null },
          ['code', { 'data-language': node.attrs.language || null }, 0]
        ];
      }
    },

    bulletList: {
      content: 'item+',
      group: 'block',
      parseDOM: [
        {
          tag: 'ul'
        }
      ],
      toDOM() {
        return ['ul', 0];
      }
    },

    orderedList: {
      content: 'item+',
      group: 'block',
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom) {
            const start = parseInt(dom.getAttribute('start'), 10);

            return {
              order: dom.hasAttribute('start') ? start : 1
            };
          }
        }
      ],
      toDOM(node) {
        return [
          'ol',
          {
            start: node.attrs.order === 1 ? null : node.attrs.order
          },
          0
        ];
      }
    },

    item: {
      content: '(paragraph | codeBlock | bulletList | orderedList)*',
      defining: true,
      parseDOM: [{ tag: 'li' }],
      toDOM() {
        return ['li', 0];
      }
    },

    blockQuote: {
      content: 'block+',
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() {
        return ['blockquote', 0];
      }
    },

    // block - empty element
    thematicBreak: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return ['div', ['hr']];
      }
    },

    // inline
    text: {
      group: 'inline'
    },

    // inline - empty element
    image: {
      inline: true,
      attrs: {
        src: {},
        title: { default: null },
        alt: { default: null }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom) {
            return {
              src: dom.getAttribute('src'),
              title: dom.getAttribute('title'),
              alt: dom.getAttribute('alt')
            };
          }
        }
      ],
      toDOM(node) {
        return ['img', node.attrs];
      }
    },

    linebreak: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() {
        return ['br'];
      }
    }
  },

  marks: {
    strong: {
      parseDOM: [{ tag: 'b' }, { tag: 'strong' }],
      toDOM() {
        return ['strong'];
      }
    },

    emph: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }],
      toDOM() {
        return ['em'];
      }
    },

    link: {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom) {
            return {
              href: dom.getAttribute('href'),
              title: dom.getAttribute('title') || null
            };
          }
        }
      ],
      toDOM(node) {
        return ['a', node.attrs];
      }
    },

    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM() {
        return ['code'];
      }
    }
  }
};

export function createBasicSchema() {
  return new Schema(basicSchema);
}

export const nodes = {
  doc: {
    content: 'block+'
  },

  // block
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0];
    }
  },

  heading: {
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
  },

  codeBlock: {
    content: 'text*',
    group: 'block',
    attrs: {
      class: { default: null },
      language: { default: null }
    },
    code: true,
    defining: true,
    marks: '',
    parseDOM: [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs(dom) {
          const className = dom.getAttribute('class');
          const language = className.split('lang-');

          return {
            class: className,
            language
          };
        }
      }
    ],
    toDOM(node) {
      return [
        'pre',
        { class: node.attrs.class || null },
        ['code', { 'data-language': node.attrs.language || null }, 0]
      ];
    }
  },

  bulletList: {
    content: 'item+',
    group: 'block',
    parseDOM: [
      {
        tag: 'ul'
      }
    ],
    toDOM() {
      return ['ul', 0];
    }
  },

  orderedList: {
    content: 'item+',
    group: 'block',
    attrs: { order: { default: 1 } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs(dom) {
          const start = parseInt(dom.getAttribute('start'), 10);

          return {
            order: dom.hasAttribute('start') ? start : 1
          };
        }
      }
    ],
    toDOM(node) {
      return [
        'ol',
        {
          start: node.attrs.order === 1 ? null : node.attrs.order
        },
        0
      ];
    }
  },

  item: {
    content: '(paragraph | codeBlock | bulletList | orderedList)*',
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM() {
      return ['li', 0];
    }
  },

  blockQuote: {
    content: 'block+',
    group: 'block',
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return ['blockquote', 0];
    }
  },

  // block - empty element
  thematicBreak: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return ['div', ['hr']];
    }
  },

  // inline
  text: {
    group: 'inline'
  },

  // inline - empty element
  image: {
    inline: true,
    attrs: {
      src: {},
      title: { default: null },
      alt: { default: null }
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(dom) {
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt')
          };
        }
      }
    ],
    toDOM(node) {
      return ['img', node.attrs];
    }
  },

  linebreak: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return ['br'];
    }
  }
};

export const marks = {
  emph: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }],
    toDOM() {
      return ['em'];
    }
  },

  link: {
    attrs: {
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(dom) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title') || null
          };
        }
      }
    ],
    toDOM(node) {
      return ['a', node.attrs];
    }
  },

  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return ['code'];
    }
  }
};
