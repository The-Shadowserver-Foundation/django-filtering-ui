import { mockWindowLocation } from "@/testing";
import useQueryFilters from "./useQueryFilters";
import { Grouping } from "@/utils/query";

describe("tests for useQueryFilters", () => {
  beforeEach(async () => {
    mockWindowLocation();
  });

  test("successfully uses query filters data", () => {
    const qValue = ["and", [["name", { lookup: "icontains", value: "bar" }]]];
    const q = Grouping.fromObject(qValue);
    window.location.search = `?q=${JSON.stringify(qValue)}`;

    const [query, originalData] = useQueryFilters();

    // Check for the expected results
    // Note, objects will not be identical
    // because internal identifiers are randomly generated
    expect(query.toObject()).toStrictEqual(q.toObject());
    // Check the originalData is equal to the query string value
    expect(originalData).toEqual(qValue);
  });

  test("when query filters are undefined", () => {
    const [query, originalData] = useQueryFilters();

    // Check for a null value
    expect(query).toEqual(null);
    // Check the originalData is equal to the query string value
    expect(originalData).toEqual(null);
  });

  test("when creation of a default value", () => {
    const [query, originalData] = useQueryFilters({ createDefault: true });

    // Check for the created default
    expect(query.operation).toEqual("and");
    expect(query.conditions.length).toEqual(1);
    expect(query.conditions[0].identifier).toBeUndefined();
    expect(query.conditions[0].relative).toBeUndefined();
    expect(query.conditions[0].value).toBeUndefined();
    // Check the originalData is equal to the query string value
    expect(originalData).toEqual(null);
  });

  test("error when parsing", () => {
    window.location.search = '?q=["and"[]';

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    useQueryFilters();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0]).toContain("Error parsing JSON:");
  });
});
