import { mount } from "@vue/test-utils";
import Select from "./Select.vue";
import { flattenChoiceOptionsReducer } from "@/utils/choices";

describe("Test Select component", () => {
  test("model binding", async () => {
    const options = [
      { value: "foo", label: "Foo", disabled: false },
      { value: "bar", label: "Bar", disabled: false },
      { value: "baz", label: "Baz", disabled: false },
    ];
    const initialValue = "baz";
    const wrapper = mount(Select, {
      props: {
        options,
        // macro expansion props for `v-model`
        modelValue: initialValue,
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    expect(wrapper.props("modelValue")).toBe(initialValue);
    const selection = "bar";
    await wrapper.find("select").setValue(selection);
    expect(wrapper.props("modelValue")).toBe(selection);

    // Check default usage for blank option value and given options
    const expectedLabelValueList = [["", ""]].concat(
      options.map((x) => [x.label, x.value]),
    );
    expect(
      wrapper
        .findAll("select option")
        .map((e) => [e.text(), e.attributes("value")]),
    ).toEqual(expectedLabelValueList);
  });

  test("usage of a false `includeBlank` property", async () => {
    const options = [{ value: "foo", label: "Foo", disabled: false }];
    const wrapper = mount(Select, {
      props: {
        includeBlank: false, // TARGET
        options,
        // macro expansion props for `v-model`
        modelValue: "",
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    // Check blank entry is not included
    expect(
      wrapper
        .findAll("select option")
        .map((e) => [e.text(), e.attributes("value")]),
    ).toEqual(options.map((x) => [x.label, x.value]));
  });

  test("disabled selected option", async () => {
    const options = [
      { value: "foo", label: "Foo", disabled: false },
      { value: "bar", label: "Bar", disabled: true },
      { value: "baz", label: "Baz", disabled: true },
    ];
    const wrapper = mount(Select, {
      props: {
        options,
        // macro expansion props for `v-model`
        modelValue: "",
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    // Check default usage for blank option value and given options
    // Specifically check for disabled options
    expect(
      wrapper.findAll("select option").map((e) => ({
        label: e.text(),
        value: e.attributes("value"),
        disabled: "disabled" in e.attributes(),
      })),
    ).toEqual([{ label: "", value: "", disabled: false }].concat(options));
  });

  test("grouped options", async () => {
    const options = [
      { value: "baz", label: "Baz", disabled: false },
      {
        label: "Foo",
        value: [
          { value: "foo-l", label: "FooL", disabled: false },
          { value: "foo-z", label: "FooZ", disabled: false },
        ],
      },
      {
        label: "Bar",
        value: [
          { value: "bar-b", label: "BarB", disabled: false },
          { value: "bar-k", label: "BarK", disabled: true },
        ],
      },
    ];
    const initialValue = "";
    const wrapper = mount(Select, {
      props: {
        options,
        // macro expansion props for `v-model`
        modelValue: initialValue,
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    // Check all options to be listed regardless of their grouping
    const flat_options = options.reduce(flattenChoiceOptionsReducer, []);
    expect(
      wrapper.findAll("select option").map((e) => ({
        label: e.text(),
        value: e.attributes("value"),
        disabled: "disabled" in e.attributes(),
      })),
    ).toEqual([{ label: "", value: "", disabled: false }].concat(flat_options));

    // Check selection of sub-option.
    expect(wrapper.props("modelValue")).toBe(initialValue);
    const selection = "bar-b";
    await wrapper.find("select").setValue(selection);
    expect(wrapper.props("modelValue")).toBe(selection);
  });

  test("preserves literal value", async () => {
    const initialValue = false;
    const options = [
      { value: true, label: "Yes", disabled: false },
      { value: false, label: "No", disabled: false },
    ];
    const wrapper = mount(Select, {
      props: {
        options,
        includeBlank: false,
        // macro expansion props for `v-model`
        modelValue: initialValue,
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });

    // Check selection change sets the model value
    expect(wrapper.props("modelValue")).toBe(initialValue);
    const selection = true;
    await wrapper.find("select").setValue(selection);
    expect(wrapper.props("modelValue")).toBe(selection);

    // Check The options provided as as defined.
    expect(
      wrapper.findAll("select option").map((e) => ({
        label: e.text(),
        value: e.attributes("value"),
        disabled: "disabled" in e.attributes(),
      })),
      // Check equality, where datapoint is going to be cast to a string in the html attribute
    ).toEqual(options.map((o) => ({ ...o, value: o.value.toString() })));
  });
});
