/* Mappings from operator name to name that read "<operator-mapping> of" */
const OPERATOR_MAP = {
  and: "all",
  or: "any",
  not: "none",
};

const LOOKUP_MAP = {
  istartswith: "starts with",
  iendswith: "ends with",
  icontains: "contains",
  iexact: "equals",
  exact: "equals",
};

export const lookupToLabel = (lookup) => {
  return LOOKUP_MAP[lookup];
};

export const operatorToLabel = (op) => {
  return OPERATOR_MAP[op];
};
