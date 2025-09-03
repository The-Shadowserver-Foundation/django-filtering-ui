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
