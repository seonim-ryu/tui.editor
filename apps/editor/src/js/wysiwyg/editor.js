import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { createGfmSchema } from './schema/gfm';

const CONTENTS_CLASS_NAME = 'tui-editor-contents';

const schema = createGfmSchema();
const baseStates = {
  schema,
  plugins: [
    keymap(baseKeymap),
    new Plugin({
      props: {
        attributes: { class: CONTENTS_CLASS_NAME }
      }
    })
  ]
};

export default class WysiwygEditor {
  constructor(container) {
    this.view = this.createEditorView(container);
  }

  createEditorView(container) {
    const state = EditorState.create({ ...baseStates });

    return new EditorView(container, { state });
  }

  setValue(doc) {
    const addedStates = { doc };
    const newState = EditorState.create({ ...baseStates, ...addedStates });

    this.view.updateState(newState);
  }

  /**
   * @TODO add logic to set min-eight value
   */
  setMinHeight() {}

  /**
   * @TODO change return value to prosemirror model
   */
  getValue() {
    return '';
  }

  getSchema() {
    return this.view.state.schema;
  }

  /**
   * @TODO add logic to focus editor element
   */
  focus() {}
}
