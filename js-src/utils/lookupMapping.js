/* Mappings from operator name to name that read "<operator-mapping> of" */
const OPERATOR_MAP = {
  and: "all",
  or: "any",
  not: "none",
};

export const operatorToLabel = (op) => {
  return OPERATOR_MAP[op];
};
