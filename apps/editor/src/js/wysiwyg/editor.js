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

// @TODO WwEditor -> WysiwygEditor
export default class WwEditor {
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

  getSchema() {
    return this.view.state.schema;
  }
}
