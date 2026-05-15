import { Grouping, Condition } from "./query";

describe("query structure testing", () => {
  test("grouping defaults", () => {
    const grouping = new Grouping();
    expect(grouping.operation).toBe("and");
    expect(grouping.conditions).toEqual([]);
  });

  test("add single condition", () => {
    const conditions = [
      new Condition("name", "icontains", "foo"),
      new Condition("description", "icontains", "bar"),
    ];

    const q = new Grouping("and", Array.from(conditions));
    // add a new Condition
    const newCondition = new Condition("name", "icontains", "bar");
    q.addConditions(newCondition);
    expect(q.conditions.length).toBe(3);
    expect(q.conditions).toEqual(conditions.concat([newCondition]));
  });

  test("remove single condition", () => {
    const conditions = [
      new Condition("name", "icontains", "foo"),
      new Condition("description", "icontains", "bar"),
      new Condition(),
    ];

    const q = new Grouping("and", Array.from(conditions));

    // Remove the last Condition
    q.removeConditions(q.conditions[q.conditions.length - 1]);
    expect(q.conditions.length).toBe(2);
    expect(q.conditions).toEqual(conditions.slice(0, 2));
  });

  test("remove multiple conditions", () => {
    const conditions = [
      new Condition("name", "icontains", "foo"),
      new Condition(),
      new Condition("description", "icontains", "bar"),
      new Condition(),
    ];

    const q = new Grouping("and", Array.from(conditions));

    // Remove the last Condition
    q.removeConditions(q.conditions[1], q.conditions[3]);
    expect(q.conditions.length).toBe(2);
    expect(q.conditions).toEqual([conditions[0], conditions[2]]);
  });

  test("condition toObject maintains valid JSON data types", () => {
    const conditions = [
      new Condition("occurence_count", "gte", 5),
      new Condition("created", "gte", new Date("Tue Sep 02 2025")),
      new Condition("is_family", "exact", true),
    ];

    const q = new Grouping("and", Array.from(conditions));
    const obj = q.toObject();
    const expectedObj = [
      "and",
      [
        [
          "occurence_count",
          {
            lookup: "gte",
            value: 5,
          },
        ],
        [
          "created",
          {
            lookup: "gte",
            value: "2025-09-02T00:00:00.000Z",
          },
        ],
        [
          "is_family",
          {
            lookup: "exact",
            value: true,
          },
        ],
      ],
    ];
    expect(JSON.parse(JSON.stringify(obj))).toEqual(expectedObj);
  });

  describe("Condition.setRelative", () => {
    test("sets the relative and initializes value for a date-range type", () => {
      const condition = new Condition("created", "icontains", "foo");
      condition.setRelative("range", "date-range");
      expect(condition.relative).toBe("range");
      expect(condition.value).toEqual([undefined, undefined]);
    });

    test("sets the relative without altering value for other types", () => {
      const condition = new Condition("name", "iexact", "foo");
      condition.setRelative("icontains", "input");
      expect(condition.relative).toBe("icontains");
      expect(condition.value).toBe("foo");
    });

    test("switching from date-range to partial-date-range preserves the existing value", () => {
      const value = ["2024-01-01", "2024-12-31"];
      const condition = new Condition("created", "range", value);
      condition.setRelative("partial_range", "partial-date-range");
      expect(condition.value).toBe(value);
    });

    test("switching from partial-date-range to date-range preserves the existing value", () => {
      const value = ["2024-01-01", null];
      const condition = new Condition("created", "partial_range", value);
      condition.setRelative("range", "date-range");
      expect(condition.value).toBe(value);
    });
  });

  describe("Condition.initializeValueForLookupType", () => {
    test("initializes value to [undefined, undefined] for date-range", () => {
      const condition = new Condition("created", "range");
      condition.initializeValueForLookupType("date-range");
      expect(condition.value).toEqual([undefined, undefined]);
    });

    test("initializes value to [undefined, undefined] for partial-date-range", () => {
      const condition = new Condition("created", "partial_range");
      condition.initializeValueForLookupType("partial-date-range");
      expect(condition.value).toEqual([undefined, undefined]);
    });

    test("preserves an existing array value", () => {
      const value = ["2024-01-01", "2024-12-31"];
      const condition = new Condition("created", "range", value);
      condition.initializeValueForLookupType("date-range");
      expect(condition.value).toBe(value);
    });

    test("does not alter value for non-date-range lookup types", () => {
      const condition = new Condition("name", "icontains", "foo");
      condition.initializeValueForLookupType("input");
      expect(condition.value).toBe("foo");
    });
  });

  test("validates falsy values", () => {
    const conditions = [
      new Condition("occurence_count", "gte", 0),
      new Condition("created", "gte", new Date("Tue Sep 02 2025")),
      new Condition("is_family", "exact", false),
    ];

    const q = new Grouping("and", Array.from(conditions));
    // Test each of the conditions is valid
    expect(
      q.conditions.reduce(
        (acc, condition) => acc && condition.validate(),
        true,
      ),
    ).toBe(true);
  });
});
