import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';

// schema
import { nodes, marks } from './schema/basic';
import { nodes as gfmNodes, marks as gfmMarks } from './schema/gfm';

// nodes & marks (extensions)
import { Doc } from './nodes/doc';
import { Paragraph } from './nodes/paragraph';
import { Heading } from './nodes/heading';
import { Strong } from './marks/strong';

// plugin
import { stylingContainer } from './plugins/stylingContainer';
import { getExtensionsKeyMap, getHistoryKeyMap } from './plugins/helper/keyMapHelper';

import ExtensionManager from '../extension';

export default class WysiwygEditor {
  constructor(el) {
    this.el = el;

    this.extension = this.createExtension();

    this.schema = this.createSchema();

    this.keyMap = this.createKeyMap();

    this.state = this.createState();

    this.view = this.createView();

    this.commands = this.createCommand();
  }

  createExtension() {
    return new ExtensionManager([new Doc(), new Paragraph(), new Heading(), new Strong()]);
  }

  createKeyMap() {
    const keyMap = this.extension.keyMap({
      schema: this.schema
    });

    return {
      ...baseKeymap,
      ...getExtensionsKeyMap(keyMap),
      ...getHistoryKeyMap()
    };
  }

  createSchema() {
    // @TODO change logic from extended object to 'this.extension'
    return new Schema({
      nodes: {
        ...this.extension.nodes,
        ...nodes,
        ...gfmNodes
      },
      marks: {
        ...this.extension.marks,
        ...marks,
        ...gfmMarks
      }
    });
  }

  createState(addedStates) {
    return EditorState.create({
      schema: this.schema,
      plugins: [keymap({ ...this.keyMap }), stylingContainer(), history()],
      ...addedStates
    });
  }

  createView() {
    return new EditorView(this.el, {
      state: this.state
    });
  }

  createCommand() {
    return this.extension.commands({
      schema: this.schema,
      view: this.view
    });
  }

  setModel(doc) {
    const newState = this.createState({ doc });

    this.view.updateState(newState);
  }

  /**
   * @TODO remove -> change setModel
   */
  setValue() {}

  /**
   * @TODO add logic to set min-eight value
   */
  setMinHeight() {}

  /**
   * @TODO remove -> change getModel
   */
  getValue() {
    return '';
  }

  getModel() {
    return this.view.state.doc;
  }

  getSchema() {
    return this.view.state.schema;
  }

  /**
   * @TODO add logic to focus editor element
   */
  focus() {}
}
