import { undo, redo } from 'prosemirror-history';

export function getHistoryKeyMap() {
  return {
    'Mod-z': undo,
    'Shift-Mod-z': redo
  };
}
