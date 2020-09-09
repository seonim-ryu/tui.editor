export const basicNodeMap = {
  // block
  paragraph: { block: 'paragraph' },

  heading: {
    block: 'heading',
    getAttrs: node => {
      return { level: node.level };
    }
  },

  codeBlock: {
    block: 'codeBlock',
    getAttrs: node => {
      return { language: node.info || '' };
    },
    noCloseToken: true
  },

  bulletList: { block: 'bulletList' },

  orderedList: {
    block: 'orderedList',
    getAttrs: node => {
      return { order: node.start };
    }
  },

  item: { block: 'item' },

  blockQuote: { block: 'blockQuote' },

  // block - empty element
  thematicBreak: { node: 'thematicBreak' },

  // inline - empty element
  image: {
    node: 'image',
    getAttrs: node => {
      const { destination, title, firstChild } = node;

      return {
        src: destination,
        title: title || null,
        alt: firstChild && firstChild.literal
      };
    }
  },

  // mark
  strong: { mark: 'strong' },

  emph: { mark: 'emph' },

  link: {
    mark: 'link',
    getAttrs: node => {
      const { destination, title } = node;

      return {
        href: destination,
        title: title || null
      };
    }
  },

  code: { mark: 'code', noCloseToken: true }
};

export const gfmNodeMap = {
  // block
  item: {
    block: 'item',
    getAttrs: node => {
      const { task, checked } = node.listData;

      return { task, checked };
    }
  },

  table: { block: 'table' },

  tableHead: { block: 'tableHead' },

  tableBody: { block: 'tableBody' },

  tableRow: { block: 'tableRow' },

  tableHeadCell: { block: 'tableHeadCell' },

  tableBodyCell: { block: 'tableBodyCell' },

  // mark
  strike: { mark: 'strike' }
};
