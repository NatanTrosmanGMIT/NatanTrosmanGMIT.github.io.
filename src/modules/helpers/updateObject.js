export default (object, values) => {
  for (let fieldKey of Object.keys(object)) {
    for (let valKey of Object.keys(values)) {
      if (fieldKey === valKey) {
        object[fieldKey] = values[valKey];
      }
    }
  }
};
