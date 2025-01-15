export const exampleSchemaOne = {
  operators: {},
  filters: {
    name: {
      default_lookup: "iexact",
      lookups: {
        icontains: { type: "input" },
        iexact: { type: "input" },
      },
      label: "Name",
    },
    description: {
      default_lookup: "icontains",
      lookups: {
        icontains: { type: "input" },
        iendswith: { type: "input" },
        istartswith: { type: "input" },
      },
      label: "Description",
    },
  },
};

export const exampleQValueOne = [
  "or",
  [
    ["name", { lookup: "iexact", value: "foo" }],
    ["description", { lookup: "icontains", value: "foo." }],
  ],
];

export const exampleSchemaTwo = {
  operators: {},
  filters: {
    // Example comes from MITRE Software object properties
    // where type is a CharField with choices
    // and is_family is a BooleanField.
    type: {
      default_lookup: "exact",
      lookups: {
        exact: {
          type: "choice",
          label: "is",
          choices: [
            ["tool", "Tool"],
            ["malware", "Malware"],
          ],
        },
        icontains: {
          type: "input",
          label: "contains",
        },
      },
      label: "Type",
    },
    is_family: {
      default_lookup: "exact",
      lookups: {
        exact: {
          type: "toggle",
          label: "is",
          true_choice: [true, "Yes"],
          false_choice: [false, "No"],
        },
      },
      label: "Is family?",
    },
  },
};
