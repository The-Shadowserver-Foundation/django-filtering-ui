import { Condition } from "@/utils/query";

import { exampleSchemaOne } from "@/testing/data";
import { mountFactory } from "../../../testing/helpers";
import ConditionRow from "./ConditionRow.vue";

describe("testing ConditionRow", () => {
  const completeSchema = { ...exampleSchemaOne };
  const schema = Object.entries(completeSchema.filters).map(([k, v]) => ({
    name: k,
    ...v,
  }));
  const mountTarget = mountFactory(ConditionRow, {
    props: { schema },
  });

  test("renders condition", (context) => {
    const [identifier, relative, value] = ["name", "iexact", "foo"];
    const condition = new Condition(identifier, relative, value);
    const schema = context.schema;
    const wrapper = mountTarget({
      props: { condition },
    });

    // Check identifier
    const identifierSelect = wrapper.get(".col:nth-of-type(1) select");
    expect(identifierSelect.element.value).toBe(identifier);
    // Check relative
    const relativeSelect = wrapper.get(".col:nth-of-type(2) select");
    expect(relativeSelect.element.value).toBe(relative);
    // Check value
    const valueInput = wrapper.get(".col:nth-of-type(3) input");
    expect(valueInput.element.value).toBe(value);
  });

  test("remove button emits 'remove' event", (context) => {
    const condition = new Condition();
    const schema = context.schema;
    const wrapper = mountTarget({
      props: { condition },
    });

    // Get remove button and trigger
    wrapper.get(".actions .btn-delete").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("remove");
  });

  test("identifier selection sets corresponding relative value", async (context) => {
    // When the user select the identifier (e.g. Name field),
    // the corresponding relative (e.g. icontains, iexact, etc. lookups)
    // is set to the default first value
    // or is left the same if the changed from identifier has the same relative value available.
    const condition = new Condition();
    const schema = context.schema;
    const wrapper = mountTarget({
      props: { condition },
    });

    const identifierSelect = wrapper.get(".col:nth-of-type(1) select");
    const relativeSelect = wrapper.get(".col:nth-of-type(2) select");
    const valueInput = wrapper.get(".col:nth-of-type(3) input");

    // Verify the relative and value inputs are disabled,
    // because the identifier input has no value.
    expect(identifierSelect.element.value).toBe("");
    expect(identifierSelect.isDisabled()).toBe(false);
    expect(relativeSelect.element.value).toBe("");
    expect(relativeSelect.isDisabled()).toBe(true);
    expect(valueInput.element.value).toBe("");
    expect(valueInput.isDisabled()).toBe(true);

    let currentIdentifier;

    // 1) Set the identifier to "description".
    currentIdentifier = "description";
    await identifierSelect.setValue(currentIdentifier);
    // Check relative defaults to first available option
    expect(relativeSelect.element.value).toBe(
      completeSchema.filters[currentIdentifier].lookups[0],
    );
    await relativeSelect.setValue("istartswith");
    await valueInput.setValue("testing startswith");

    // 2) Set the identifier to "name".
    currentIdentifier = "name";
    await identifierSelect.setValue(currentIdentifier);
    // Expect the relative to default to first available option and value
    // to be reset, because the previous relative is no longer an available option
    expect(relativeSelect.element.value).toBe(
      completeSchema.filters[currentIdentifier].lookups[0],
    );
    expect(valueInput.element.value).toBe("");

    // 2.a) Set the relative to `icontains`,
    // which is shared between 'name' and 'description' fields.
    await relativeSelect.setValue("icontains");
    await valueInput.setValue("testing contains");

    // 3) Set the identifier back to 'description'.
    currentIdentifier = "description";
    await identifierSelect.setValue(currentIdentifier);
    // Expect the relative and value to remain,
    // because the relative is available for both 'name' and 'description' identifiers.
    expect(relativeSelect.element.value).toBe("icontains");
    expect(valueInput.element.value).toBe("testing contains");
  });

  test.todo(
    "boolean field-type renders true or false value selection",
    () => {},
  );
});
