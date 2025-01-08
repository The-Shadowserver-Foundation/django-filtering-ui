export const exampleSchemaOne = {
  operators: {},
  filters: {
    name: {
      type: "field",
      field_type: "string",
      lookups: ["iexact", "icontains"],
      label: "Name",
    },
    description: {
      type: "field",
      field_type: "string",
      lookups: ["icontains", "iendswith", "istartswith"],
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
