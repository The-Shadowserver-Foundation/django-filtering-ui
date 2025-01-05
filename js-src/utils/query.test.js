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
});
