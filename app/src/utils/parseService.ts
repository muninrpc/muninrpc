// logic for assembling the arguments object
export function parseService(typeArray, configArguments, configElements, state) {
  // 5 possible cases:
  // case: fields array is empty
  if (typeArray.field.length === 0) {
    configArguments = null;
    configElements[typeArray.name] = {
      name: typeArray.name,
      type: "TYPE_MESSAGE",
      label: "LABEL_OPTIONAL",
    };
  } else {
    typeArray.field.forEach(f => {
      // case: not a message and not repeating
      if (f.type !== "TYPE_MESSAGE" && f.label !== "LABEL_REPEATED") {
        configArguments[f.name] = null;
        // if(!configElements[typeArray.name]) configElements[typeArray.name] = {}
        configElements[f.name] = {
          messageName: typeArray.name,
          type: f.type,
          label: f.label,
        };
      }
      // case: not a message and repeating
      if (f.type !== "TYPE_MESSAGE" && f.label === "LABEL_REPEATED") {
        configArguments[f.name] = [null];
        // if(!configElements[typeArray.name]) configElements[typeArray.name] = {}
        configElements[f.name] = {
          name: f.name,
          messageName: typeArray.name,
          type: f.type,
          label: f.label,
        };
      }
      // case: message and not repeating
      if (f.type === "TYPE_MESSAGE" && f.label !== "LABEL_REPEATED") {
        configArguments[f.name] = {};
        // if(!configElements[f.name]) configElements[f.name] = {}
        configElements[f.name] = {
          name: f.name,
          label: f.label,
          type: f.type,
          typeName: f.typeName,
        };
        parseService(state.messageList[f.typeName].type, configArguments[f.name], configElements[f.name], state);
      }
      // case: message and repeating
      if (f.type === "TYPE_MESSAGE" && f.label === "LABEL_REPEATED") {
        configArguments[f.name] = [{}];
        configElements[f.name] = [
          {
            messageName: typeArray.name,
            label: f.label,
            type: f.type,
            typeName: f.typeName,
          },
        ];
        parseService(state.messageList[f.typeName].type, configArguments[f.name][0], configElements[f.name][0], state);
      }
    });
  }
}
