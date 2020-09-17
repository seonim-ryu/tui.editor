import { undo, redo } from 'prosemirror-history';

export function getExtensionsKeyMap(extensionsKeyMap) {
  let keyMap = {};

  Object.keys(extensionsKeyMap).forEach(extension => {
    const extensionKeyMap = extensionsKeyMap[extension];

    keyMap = { ...keyMap, ...extensionKeyMap };
  });

  return keyMap;
}

export function getHistoryKeyMap() {
  return {
    'Mod-z': undo,
    'Shift-Mod-z': redo
  };
}
