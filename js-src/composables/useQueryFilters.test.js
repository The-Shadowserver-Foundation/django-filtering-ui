import { mockWindowLocation } from "@/testing";
import useQueryFilters from "./useQueryFilters";
import { Grouping } from "@/utils/query";
import { exampleSchemaOne, exampleSchemaThree } from "@/testing/data";

describe("tests for useQueryFilters", () => {
  beforeEach(async () => {
    mockWindowLocation();
  });

  test("successfully uses query filters data", () => {
    const qValue = ["and", [["name", { lookup: "icontains", value: "bar" }]]];
    const q = Grouping.fromObject(qValue);
    window.location.search = `?q=${JSON.stringify(qValue)}`;

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

    // Check for a null value
    expect(grouping).toEqual(null);
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

    // Check for no grouping data
    expect(grouping).toBe(null);
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
