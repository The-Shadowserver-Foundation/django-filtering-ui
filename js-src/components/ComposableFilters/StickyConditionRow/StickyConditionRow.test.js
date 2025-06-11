import { Condition } from "@/utils/query";

import { mountFactory } from "@/testing/helpers";
import StickyConditionRow from "./StickyConditionRow.vue";
import { exampleSchemaThree } from "../../../testing/data";

describe("testing StickyConditionRow", () => {
  const mountTarget = mountFactory(StickyConditionRow);

  test("renders default", () => {
    const sticky_default = exampleSchemaThree.filters.type.sticky_default;
    const [identifier, relative, value] = [
      sticky_default[0],
      sticky_default[1]["lookup"],
      sticky_default[1]["value"],
    ];
    const condition = new Condition(identifier, relative, value);
    const wrapper = mountTarget({
      props: { condition, schema: exampleSchemaThree },
    });

    // Check identifier
    const identifierSelect = wrapper.get(".df-ui-col:nth-of-type(1) select");
    expect(identifierSelect.element.value).toBe(identifier);
    // Check relative
    const relativeSelect = wrapper.get(".df-ui-col:nth-of-type(2) select");
    expect(relativeSelect.element.value).toBe(relative);
    // Check value
    const valueInput = wrapper.get(".df-ui-col:nth-of-type(3) select");
    expect(valueInput.element.value).toBe(value);
  });

  test("renders existing", () => {
    // Given query data with a condition matching the sticky filter
    // render the existing condition.
    // Verify output value
  });

  test("resets to default");

  test("remove button does not emit 'remove' event", (context) => {
    const condition = new Condition();
    const wrapper = mountTarget({
      props: { condition, schema: exampleSchemaThree },
    });

    // Get remove button and try to trigger
    wrapper.get(".df-ui-row-actions #remove-condition").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("remove");
  });

  test("add button emits 'add' event", (context) => {
    const condition = new Condition();
    const wrapper = mountTarget({
      props: { condition, schema: exampleSchemaThree },
    });

    // Get remove button and try to trigger
    wrapper.get(".df-ui-row-actions #add-condition").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("add");
  });

  // test("identifier selection sets corresponding relative value", async (context) => {
  //   // When the user select the identifier (e.g. Name field),
  //   // the corresponding relative (e.g. icontains, iexact, etc. lookups)
  //   // is set to the default first value
  //   // or is left the same if the changed from identifier has the same relative value available.
  //   const condition = new Condition();
  //   const schema = exampleSchemaOne;
  //   const wrapper = mountTarget({
  //     props: { condition, schema },
  //   });

  //   const identifierSelect = wrapper.get(".col:nth-of-type(1) select");
  //   const relativeSelect = wrapper.get(".col:nth-of-type(2) select");

  //   const getValueInput = () => wrapper.get(".col:nth-of-type(3) input");

  //   // Verify the relative and value inputs are disabled,
  //   // because the identifier input has no value.
  //   expect(identifierSelect.element.value).toBe("");
  //   expect(identifierSelect.isDisabled()).toBe(false);
  //   expect(relativeSelect.element.value).toBe("");
  //   expect(relativeSelect.isDisabled()).toBe(true);
  //   expect(getValueInput().element.value).toBe("");
  //   expect(getValueInput().isDisabled()).toBe(true);

  //   let currentIdentifier;

  //   // 1) Set the identifier to "description".
  //   currentIdentifier = "description";
  //   await identifierSelect.setValue(currentIdentifier);
  //   // Check relative defaults to the default_lookup option.
  //   expect(relativeSelect.element.value).toBe(
  //     schema.filters[currentIdentifier].default_lookup,
  //   );
  //   await relativeSelect.setValue("istartswith");
  //   await getValueInput().setValue("testing startswith");

  //   // 2) Set the identifier to "name".
  //   currentIdentifier = "name";
  //   await identifierSelect.setValue(currentIdentifier);
  //   // Expect the relative to default to the default_lookup option and the value
  //   // to be reset, because the previous relative is no longer an available option.
  //   expect(relativeSelect.element.value).toBe(
  //     schema.filters[currentIdentifier].default_lookup,
  //   );
  //   expect(getValueInput().element.value).toBe("");

  //   // 2.a) Set the relative to `icontains`,
  //   // which is shared between 'name' and 'description' fields.
  //   await relativeSelect.setValue("icontains");
  //   await getValueInput().setValue("testing contains");

  //   // 3) Set the identifier back to 'description'.
  //   currentIdentifier = "description";
  //   await identifierSelect.setValue(currentIdentifier);
  //   // Expect the relative and value to remain,
  //   // because the relative is available for both 'name' and 'description' identifiers.
  //   expect(relativeSelect.element.value).toBe("icontains");
  //   expect(getValueInput().element.value).toBe("testing contains");
  // });

  // test("toggled lookup type renders true or false value selection", async () => {
  //   const [identifier, relative, value] = ["is_family", "exact", false];
  //   const condition = new Condition(identifier, relative, value);
  //   const wrapper = mountTarget({
  //     props: { condition, schema: exampleSchemaTwo },
  //   });

  //   // Check identifier
  //   const identifierSelect = wrapper.get(".col:nth-of-type(1) select");
  //   expect(identifierSelect.element.value).toBe(identifier);
  //   // Check relative
  //   const relativeSelect = wrapper.get(".col:nth-of-type(2) select");
  //   expect(relativeSelect.element.value).toBe(relative);
  //   // Check value
  //   const [trueValueInput, falseValueInput] = wrapper.findAll(
  //     ".col:nth-of-type(3) input",
  //   );
  //   // Looking for the correct initial value
  //   expect(trueValueInput.element.checked).toBe(false);
  //   expect(falseValueInput.element.checked).toBe(true);
  // });

  // test("choice lookup type renders select with choice options", async () => {
  //   const [identifier, relative, value] = ["type", "exact", "tool"];
  //   const condition = new Condition(identifier, relative, value);
  //   const wrapper = mountTarget({
  //     props: { condition, schema: exampleSchemaTwo },
  //   });

  //   // Check identifier
  //   const identifierSelect = wrapper.get(".col:nth-of-type(1) select");
  //   expect(identifierSelect.element.value).toBe(identifier);
  //   // Check relative
  //   const relativeSelect = wrapper.get(".col:nth-of-type(2) select");
  //   expect(relativeSelect.element.value).toBe(relative);
  //   // Check value
  //   const valueSelect = wrapper.get(".col:nth-of-type(3) select");
  //   expect(valueSelect.element.value).toBe(value);
  //   await valueSelect.setValue("malware");
  //   expect(valueSelect.element.value).toBe("malware");
  // });
});
