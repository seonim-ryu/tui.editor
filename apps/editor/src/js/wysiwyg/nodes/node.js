export default class Node {
  setEditor(editor) {
    this.editor = editor;
  }

  get type() {
    return 'node';
  }
}
