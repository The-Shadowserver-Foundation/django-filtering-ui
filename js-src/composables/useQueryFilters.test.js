import { mockWindowLocation } from "@/testing";
import useQueryFilters from "./useQueryFilters";
import { Condition, Grouping } from "@/utils/query";
import {
  exampleSchemaOne,
  exampleSchemaTwo,
  exampleSchemaThree,
  exampleSchemaFour,
} from "@/testing/data";

describe("tests useQueryFilters parses to reactive objects", () => {
  beforeEach(async () => {
    mockWindowLocation();
  });

  test("successfully uses query filters data", () => {
    const qValue = ["and", [["name", { lookup: "icontains", value: "bar" }]]];
    const q = Grouping.fromObject(qValue);
    window.location.assign(`?q=${JSON.stringify(qValue)}`);

    const { grouping, original } = useQueryFilters({
      optionsSchema: exampleSchemaOne,
    });

    // Check for the expected results
    // Note, objects will not be identical
    // because internal identifiers are randomly generated
    expect(grouping.toObject()).toStrictEqual(q.toObject());
    // Check the originalData is equal to the query string value
    expect(original).toEqual(qValue);
  });

  test("when query filters are undefined", () => {
    const { grouping, original } = useQueryFilters({
      optionsSchema: exampleSchemaOne,
    });

    // Check for a blank grouping
    expect(grouping.operation).toEqual("and");
    expect(grouping.conditions.length).toEqual(0);
    // Check the originalData is equal to the query string value
    expect(original).toEqual(null);
  });

  test("when creation of a default value", () => {
    const { grouping, stickies, original } = useQueryFilters({
      createDefault: true,
      optionsSchema: exampleSchemaThree,
    });

    // Check for the created default
    expect(grouping.operation).toEqual("and");
    expect(grouping.conditions.length).toEqual(1);
    expect(grouping.conditions[0].identifier).toBeUndefined();
    expect(grouping.conditions[0].relative).toBeUndefined();
    expect(grouping.conditions[0].value).toBeUndefined();
    // Check for the creation of the default sticky condition
    expect(stickies.value.length).toEqual(1);
    const typeStickyDefault = exampleSchemaThree.filters.type.sticky_default;
    expect(stickies.value[0].identifier).toEqual(typeStickyDefault[0]);
    expect(stickies.value[0].relative).toEqual(typeStickyDefault[1].lookup);
    expect(stickies.value[0].value).toEqual(typeStickyDefault[1].value);

    // Check the originalData is equal to the query string value
    expect(original).toEqual(null);
  });

  test("when no data provided, but stickies present", () => {
    const { grouping, stickies, original } = useQueryFilters({
      optionsSchema: exampleSchemaThree,
    });

    // Check for a blank grouping
    expect(grouping.operation).toEqual("and");
    expect(grouping.conditions.length).toEqual(0);
    // Check for the creation of the default sticky condition
    expect(stickies.value.length).toEqual(1);
    const typeStickyDefault = exampleSchemaThree.filters.type.sticky_default;
    expect(stickies.value[0].identifier).toEqual(typeStickyDefault[0]);
    expect(stickies.value[0].relative).toEqual(typeStickyDefault[1].lookup);
    expect(stickies.value[0].value).toEqual(typeStickyDefault[1].value);

    // Check the originalData is equal to the query string value
    expect(original).toEqual(null);
  });

  test("when sticky condition included in data", async () => {
    const qTypeValue = "all";
    const qValue = ["and", [["type", { lookup: "exact", value: qTypeValue }]]];
    const q = Grouping.fromObject(qValue);
    window.location.search = `?q=${JSON.stringify(qValue)}`;

    // Target
    const { grouping, stickies, original } = useQueryFilters({
      createDefault: true,
      optionsSchema: exampleSchemaThree,
    });

    // Check for the created default
    expect(grouping.operation).toEqual("and");
    expect(grouping.conditions.length).toEqual(1);
    expect(grouping.conditions[0].identifier).toBeUndefined();
    expect(grouping.conditions[0].relative).toBeUndefined();
    expect(grouping.conditions[0].value).toBeUndefined();
    // Check for the creation of the default sticky condition
    expect(stickies.value.length).toEqual(1);
    const typeStickyDefault = exampleSchemaThree.filters.type.sticky_default;
    expect(stickies.value[0].identifier).toEqual(typeStickyDefault[0]);
    expect(stickies.value[0].relative).toEqual(typeStickyDefault[1].lookup);
    expect(stickies.value[0].value).toEqual(qTypeValue);

    // Check for the expected results
    // Note, objects will not be identical
    // because internal identifiers are randomly generated
    expect(grouping.toObject()).toStrictEqual([
      "and",
      [[undefined, { lookup: undefined, value: undefined }]],
    ]);
    // Check the original data is equal to the query string value
    expect(original).toEqual(qValue);
  });

  test("error when parsing", () => {
    window.location.search = '?q=["and"[]';

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    useQueryFilters({
      optionsSchema: exampleSchemaOne,
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0]).toContain("Error parsing JSON:");
  });
});

describe("tests useQueryFilters computed properties", () => {
  beforeEach(async () => {
    mockWindowLocation();
  });

  test("rendered preserves value data type", () => {
    const qValue = [
      "and",
      [
        ["is_family", { lookup: "exact", value: true }],
        ["type", { lookup: "exact", value: "tool" }],
      ],
    ];
    // Initialize the data
    const q = Grouping.fromObject(qValue);
    window.location.assign(`?q=${JSON.stringify(qValue)}`);

    // Target
    const { grouping, stickies, rendered, original } = useQueryFilters({
      optionsSchema: exampleSchemaTwo,
    });

    // Check for initial representation of data
    expect(grouping.conditions.length).toEqual(2);
    expect(stickies.value.length).toEqual(0);
    expect(grouping.conditions.map((x) => x.identifier)).toEqual([
      "is_family",
      "type",
    ]);
    // Check initially that rendered is equal to the original
    expect(rendered.value).toEqual(JSON.stringify(original));

    // Simulate a modification
    grouping.conditions.push(new Condition("type", "exact", "malware"));
    const [operation, conditions] = JSON.parse(rendered.value);
    expect(operation).toEqual(qValue[0]);
    // Check the modification reactively updates computed property
    expect(conditions.length).toEqual(3);
    expect(conditions.map((x) => x[0])).toEqual(["is_family", "type", "type"]);
  });

  test("changedStickies contains only stickies that have changed", () => {
    const stickyCondition = ["brand", { lookup: "exact", value: "Delta" }];
    const qValue = [
      "and",
      [stickyCondition, ["name", { lookup: "icontains", value: "bar" }]],
    ];
    // Initialize the data
    const q = Grouping.fromObject(qValue);
    window.location.assign(`?q=${JSON.stringify(qValue)}`);

    // Target
    const { grouping, stickies, changedStickies } = useQueryFilters({
      optionsSchema: exampleSchemaFour,
    });

    // Check for initial representation of data
    expect(grouping.conditions.length).toEqual(1);
    expect(stickies.value.map((x) => x.identifier)).toEqual([
      "brand",
      "category",
    ]);
    // Check for the initially changed stick condition
    expect(changedStickies.value.length).toEqual(1);
    expect(changedStickies.value[0].identifier).toEqual(stickyCondition[0]);
    expect(changedStickies.value[0].relative).toEqual(
      stickyCondition[1].lookup,
    );
    expect(changedStickies.value[0].value).toEqual(stickyCondition[1].value);

    // Simulate a modification to the stickies reactively updates computed property
    stickies.value.push(new Condition("category", "exact", "Patio"));
    expect(changedStickies.value.length).toEqual(2);
    expect(changedStickies.value.map((x) => x.identifier)).toEqual([
      "brand",
      "category",
    ]);
  });

  test("rendered contains both grouping and changed stickies", () => {
    const stickyCondition = ["brand", { lookup: "exact", value: "Delta" }];
    const qValue = [
      "and",
      [stickyCondition, ["name", { lookup: "icontains", value: "bar" }]],
    ];
    // Initialize the data
    const q = Grouping.fromObject(qValue);
    window.location.assign(`?q=${JSON.stringify(qValue)}`);

    // Target
    const { grouping, stickies, rendered, original } = useQueryFilters({
      optionsSchema: exampleSchemaFour,
    });

    // Check for initial representation of data
    expect(grouping.conditions.length).toEqual(1);
    expect(stickies.value.map((x) => x.identifier)).toEqual([
      "brand",
      "category",
    ]);
    // Check initially that rendered is equal to the original
    expect(rendered.value).toEqual(JSON.stringify(original));

    // Simulate a modification to the stickies and grouping
    stickies.value.push(new Condition("category", "exact", "Patio"));
    grouping.conditions.push(new Condition("name", "icontains", "prep"));
    const [operation, conditions] = JSON.parse(rendered.value);
    expect(operation).toEqual(qValue[0]);
    // Check the modification reactively updates computed property
    expect(conditions.length).toEqual(4);
    expect(conditions.map((x) => x[0])).toEqual([
      "brand",
      "category",
      "name",
      "name",
    ]);
  });
});
