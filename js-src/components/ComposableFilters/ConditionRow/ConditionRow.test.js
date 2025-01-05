import { mount } from "@vue/test-utils";
import { Condition } from "@/utils/query";

import { exampleSchemaOne } from "@/testing/helpers";
import ConditionRow from "./ConditionRow.vue";

describe("testing ConditionRow", () => {
  beforeEach((context) => {
    context.completeSchema = exampleSchemaOne;
    context.schema = Object.entries(context.completeSchema.filters).map(
      ([k, v]) => ({
        name: k,
        ...v,
      }),
    );
  });
  test("renders condition", (context) => {
    const [identifier, relative, value] = ["name", "iexact", "foo"];
    const condition = new Condition(identifier, relative, value);
    const schema = context.schema;
    const wrapper = mount(ConditionRow, {
      props: { condition, schema },
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
    const wrapper = mount(ConditionRow, {
      props: { condition, schema },
    });

    // Get remove button and trigger
    wrapper.get(".actions .btn-delete").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("remove");
  });
  test("identifier selection maps corresponding relative options", async (context) => {
    const condition = new Condition();
    const schema = context.schema;
    const wrapper = mount(ConditionRow, {
      props: { condition, schema },
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

    // Create a function to check the relative options
    // based on the selected identifier.
    const setAndExpectOptionsToEqualSchema = async (identifierValue) => {
      // Set the identifier.
      await identifierSelect.setValue(identifierValue);
      // Check for non-disabled relative and value inputs.
      const isDisabled = identifierValue === "";
      expect(relativeSelect.isDisabled()).toBe(isDisabled);
      expect(valueInput.isDisabled()).toBe(isDisabled);

      if (identifierValue) {
        // Check for valid relative options
        expect(
          relativeSelect.findAll("option").map((x) => x.element.value),
        ).toEqual(
          expect.arrayContaining(
            context.completeSchema.filters[identifierValue].lookups,
          ),
        );
      }
    };

    await setAndExpectOptionsToEqualSchema("description");
    await setAndExpectOptionsToEqualSchema("name");
    // Lastly check unassignment of the identifier disables other input
    await setAndExpectOptionsToEqualSchema("");
  });
  test.todo(
    "boolean field-type renders true or false value selection",
    () => {},
  );
});
