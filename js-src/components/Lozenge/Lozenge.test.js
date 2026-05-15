import { mount } from "@vue/test-utils";
import { mountFactory } from "@/testing/helpers";
import { Condition } from "@/utils/query";
import Lozenge from "./index.vue";
import LozengeChoiceValue from "./LozengeChoiceValue.vue";
import LozengeDateRangeValue from "./LozengeDateRangeValue.vue";
import LozengePartialDateRangeValue from "./LozengePartialDateRangeValue.vue";

// The Lozenge component receives the schema in the "revised" array format
// produced by Listing.vue: Object.entries(filterSchema.filters).map(([k, v]) => ({ name: k, ...v }))
const schema = [
  {
    name: "title",
    label: "Title",
    lookups: {
      icontains: { type: "input", label: "contains" },
    },
  },
  {
    name: "type",
    label: "Type",
    lookups: {
      exact: {
        type: "choice",
        label: "is",
        choices: [
          ["tool", "Tool"],
          ["malware", "Malware"],
        ],
      },
    },
  },
  {
    name: "created",
    label: "Created",
    lookups: {
      range: { type: "date-range", label: "between" },
      partial_range: { type: "partial-date-range", label: "between" },
    },
  },
];

describe("Lozenge", () => {
  const mountLozenge = mountFactory(Lozenge);

  test("renders identifier, relative, and value spans", () => {
    const condition = new Condition("title", "icontains", "foo");
    const wrapper = mountLozenge({ props: { schema, condition } });

    const identifier = wrapper.get(".df-ui-lozenge-identifier");
    expect(identifier.attributes("data-value")).toBe("title");
    expect(identifier.text()).toBe("Title");

    const relative = wrapper.get(".df-ui-lozenge-relative");
    expect(relative.attributes("data-value")).toBe("icontains");
    expect(relative.text()).toBe("contains");

    const value = wrapper.get(".df-ui-lozenge-value");
    expect(value.text()).toBe("foo");
  });

  test("shows remove button by default", () => {
    const condition = new Condition("title", "icontains", "foo");
    const wrapper = mountLozenge({ props: { schema, condition } });

    expect(wrapper.find(".df-ui-lozenge-clear").exists()).toBe(true);
  });

  test("hides remove button when disableRemove is true", () => {
    const condition = new Condition("title", "icontains", "foo");
    const wrapper = mountLozenge({
      props: { schema, condition, disableRemove: true },
    });

    expect(wrapper.find(".df-ui-lozenge-clear").exists()).toBe(false);
  });

  test("emits remove event when clear is clicked", async () => {
    const condition = new Condition("title", "icontains", "foo");
    const wrapper = mountLozenge({ props: { schema, condition } });

    await wrapper.get(".df-ui-lozenge-clear").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("remove");
  });

  test("choice type: value shows label, not raw value", () => {
    const condition = new Condition("type", "exact", "tool");
    const wrapper = mountLozenge({ props: { schema, condition } });

    expect(wrapper.get(".df-ui-lozenge-value").text()).toBe("Tool");
  });

  test("date-range type: value shows both formatted dates", () => {
    const value = ["2024-01-01", "2024-12-31"];
    const condition = new Condition("created", "range", value);
    const wrapper = mountLozenge({ props: { schema, condition } });

    const expected = [
      new Date(value[0]).toLocaleDateString(),
      new Date(value[1]).toLocaleDateString(),
    ].join(" - ");
    expect(wrapper.get(".df-ui-lozenge-value").text()).toBe(expected);
  });

  describe("partial-date-range type", () => {
    test("both dates: uses schema label and shows date range", () => {
      const value = ["2024-01-01", "2024-12-31"];
      const condition = new Condition("created", "partial_range", value);
      const wrapper = mountLozenge({ props: { schema, condition } });

      expect(wrapper.get(".df-ui-lozenge-relative").text()).toBe("between");
      const expected = [
        new Date(value[0]).toLocaleDateString(),
        new Date(value[1]).toLocaleDateString(),
      ].join(" - ");
      expect(wrapper.get(".df-ui-lozenge-value").text()).toBe(expected);
    });

    test("start date only: relative becomes 'after', shows single date", () => {
      const condition = new Condition("created", "partial_range", [
        "2024-01-01",
        null,
      ]);
      const wrapper = mountLozenge({ props: { schema, condition } });

      expect(wrapper.get(".df-ui-lozenge-relative").text()).toBe("after");
      expect(wrapper.get(".df-ui-lozenge-value").text()).toBe(
        new Date("2024-01-01").toLocaleDateString(),
      );
    });

    test("end date only: relative becomes 'before', shows single date", () => {
      const condition = new Condition("created", "partial_range", [
        null,
        "2024-12-31",
      ]);
      const wrapper = mountLozenge({ props: { schema, condition } });

      expect(wrapper.get(".df-ui-lozenge-relative").text()).toBe("before");
      expect(wrapper.get(".df-ui-lozenge-value").text()).toBe(
        new Date("2024-12-31").toLocaleDateString(),
      );
    });
  });
});

describe("LozengeChoiceValue", () => {
  test("renders the label for a flat choice list", () => {
    const relativeLookupInfo = {
      choices: [
        ["tool", "Tool"],
        ["malware", "Malware"],
      ],
    };
    const wrapper = mount(LozengeChoiceValue, {
      props: { relativeLookupInfo, value: "malware" },
    });

    expect(wrapper.text()).toBe("Malware");
  });

  test("renders the label for a grouped choice list", () => {
    const relativeLookupInfo = {
      choices: [
        ["Home", [["Bath", "Bath"], ["Kitchen", "Kitchen"]]],
        ["Lawn & Garden", [["Patio", "Patio"]]],
      ],
    };
    const wrapper = mount(LozengeChoiceValue, {
      props: { relativeLookupInfo, value: "Kitchen" },
    });

    expect(wrapper.text()).toBe("Kitchen");
  });
});

describe("LozengeDateRangeValue", () => {
  test("renders both dates formatted as locale strings", () => {
    const value = ["2024-03-15", "2024-09-30"];
    const wrapper = mount(LozengeDateRangeValue, { props: { value } });

    const expected = [
      new Date(value[0]).toLocaleDateString(),
      new Date(value[1]).toLocaleDateString(),
    ].join(" - ");
    expect(wrapper.text()).toBe(expected);
  });
});

describe("LozengePartialDateRangeValue", () => {
  test("renders a date range when both values are present", () => {
    const value = ["2024-03-15", "2024-09-30"];
    const wrapper = mount(LozengePartialDateRangeValue, { props: { value } });

    const expected = [
      new Date(value[0]).toLocaleDateString(),
      new Date(value[1]).toLocaleDateString(),
    ].join(" - ");
    expect(wrapper.text()).toBe(expected);
  });

  test("renders only the start date when end is absent", () => {
    const value = ["2024-03-15", null];
    const wrapper = mount(LozengePartialDateRangeValue, { props: { value } });

    expect(wrapper.text()).toBe(new Date(value[0]).toLocaleDateString());
  });

  test("renders only the end date when start is absent", () => {
    const value = [null, "2024-09-30"];
    const wrapper = mount(LozengePartialDateRangeValue, { props: { value } });

    expect(wrapper.text()).toBe(new Date(value[1]).toLocaleDateString());
  });
});
