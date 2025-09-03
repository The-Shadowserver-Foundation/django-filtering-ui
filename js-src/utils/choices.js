export const flattenChoiceOptionsReducer = (accumulator, item) => {
  // Utility for flattening an array of grouped choices from options datastruct
  if (Array.isArray(item.value)) {
    for (const subItem of item.value) {
      flattenChoiceOptionsReducer(accumulator, subItem);
    }
  } else {
    accumulator.push(item);
  }
  return accumulator;
};

export const flattenChoicesReducer = (accumulator, [value, label]) => {
  // Utility for flattening an array of grouped choices
  if (Array.isArray(label)) {
    for (const subItem of label) {
      flattenChoicesReducer(accumulator, subItem);
    }
  } else {
    accumulator.push([value, label]);
  }
  return accumulator;
};
