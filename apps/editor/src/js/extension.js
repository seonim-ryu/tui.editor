function execCommand(view, command) {
  view.focus();
  return command(view.state, view.dispatch, view);
}

export default class ExtensionManager {
  constructor(extensions) {
    this.extensions = extensions;
  }

  get nodes() {
    return this.extensions
      .filter(extension => extension.type === 'node')
      .reduce((nodes, { name, schema }) => {
        return {
          ...nodes,
          [name]: schema
        };
      }, {});
  }

  get marks() {
    return this.extensions
      .filter(extension => extension.type === 'mark')
      .reduce((marks, { name, schema }) => {
        return {
          ...marks,
          [name]: schema
        };
      }, {});
  }

  keyMap(context) {
    return this.extensions
      .filter(({ keyMap }) => keyMap)
      .map(extension => {
        const keyMap = extension.keyMap.bind(extension);

        return keyMap(context);
      })
      .reduce((allKeyMap, keyMap) => {
        return { ...allKeyMap, ...keyMap };
      }, {});
  }

  commands(context) {
    return this.extensions
      .filter(({ commands }) => commands)
      .reduce((allCommands, extension) => {
        const { name } = extension;
        const commands = {};
        const command = extension.commands(context);

        commands[name] = () => execCommand(context.view, command);

        return {
          ...allCommands,
          ...commands
        };
      }, {});
  }
}
