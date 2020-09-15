import ToWwConvertorState from './toWwConvertorState';
import { nodeMap } from './nodeMap';

import ToMdConvertorState from './toMdConvertorState';
import { nodes, marks } from './rendererMap';

import { createNodeHandlers } from './stateHelpers';

export default class Convertor {
  constructor(schema) {
    this.schema = schema;

    this.toWwState = this._createToWwConvertorState();

    this.toMdState = this._createToMdConvertorState();
  }

  _createToWwConvertorState() {
    const { schema } = this;
    const handlers = createNodeHandlers(schema, nodeMap);

    return new ToWwConvertorState(schema, handlers);
  }

  _createToMdConvertorState() {
    return new ToMdConvertorState(nodes, marks, {
      tightLists: true
    });
  }

  toWysiwygModel(mdNode) {
    const { toWwState } = this;

    toWwState.convertNodes(mdNode);

    let doc;

    do {
      doc = toWwState.closeNode();
    } while (toWwState.stack.length);

    toWwState.resetStates();

    return doc;
  }

  toMarkdown(content) {
    const { toMdState } = this;

    toMdState.renderContent(content);

    const { out } = toMdState;

    toMdState.resetStates();

    return out;
  }
}
