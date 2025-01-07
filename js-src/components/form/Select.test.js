import { mount } from "@vue/test-utils";
import Select from "./Select.vue";

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
        modelValue: "baz",
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
});
