import { Parser } from '@toast-ui/toastmark';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { createGfmSchema } from './gfmSchema';
import { convertMdNodeToDoc } from './convertor/convertor';

const schema = createGfmSchema();
const baseStates = {
  schema,
  plugins: [keymap(baseKeymap)]
};

export default class ProseMirrorView {
  constructor(container) {
    // @TODO remove logic to create wrapper element
    const wrapper = document.createElement('div');

    wrapper.className = 'tui-editor-contents';

    container.removeChild(container.firstChild);
    container.appendChild(wrapper);

    this.view = this.createEditorView(wrapper);
  }

  createEditorView(container) {
    const state = EditorState.create({ ...baseStates });

    return new EditorView(container, { state });
  }

  /**
   * @param {HTMLElement|string} content
   */
  updateDoc(content) {
    const addedStates = {
      doc: this.getDocByContent(content)
    };
    const newState = EditorState.create({ ...baseStates, ...addedStates });

    this.view.updateState(newState);
  }

  getDocByContent(content) {
    let doc;

    if (typeof content === 'string') {
      const mdNode = new Parser().parse(content);

      doc = convertMdNodeToDoc(schema, mdNode);
    } else {
      doc = DOMParser.fromSchema(schema).parse(content);
    }

    return doc;
  }
}
