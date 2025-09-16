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
    created: {
      default_lookup: "range",
      lookups: {
        range: {
          type: "date-range",
          label: "between",
        },
      },
    },
  },
};

export const exampleSchemaThree = {
  operators: {},
  filters: {
    type: {
      default_lookup: "exact",
      lookups: {
        exact: {
          type: "choice",
          label: "is",
          choices: [
            ["any", "Any"],
            ["manual", "Manual"],
            ["bulk", "Bulk"],
          ],
        },
      },
      label: "Type",
      is_sticky: true,
      sticky_default: [
        "type",
        {
          value: "manual",
          lookup: "exact",
        },
      ],
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

export const exampleSchemaFour = {
  operators: {},
  filters: {
    brand: {
      default_lookup: "exact",
      is_sticky: true,
      label: "Brand",
      lookups: {
        exact: {
          choices: [
            ["all", "All brands"],
            ["Delta", "Delta"],
            ["MOEN", "MOEN"],
            ["Glacier Bay", "Glacier Bay"],
          ],
          label: "is",
          type: "choice",
        },
      },
      sticky_default: ["brand", { lookup: "exact", value: "MOEN" }],
    },
    category: {
      default_lookup: "exact",
      is_sticky: true,
      label: "Category",
      lookups: {
        exact: {
          choices: [
            [
              "Home",
              [
                ["Bath", "Bath"],
                ["Kitchen", "Kitchen"],
              ],
            ],
            ["Lawn & Garden", [["Patio", "Patio"]]],
          ],
          label: "equals",
          type: "choice",
        },
      },
      sticky_default: ["category", { lookup: "exact", value: "Kitchen" }],
    },
    name: {
      default_lookup: "icontains",
      label: "Name",
      lookups: { icontains: { label: "contains", type: "input" } },
    },
  },
};
