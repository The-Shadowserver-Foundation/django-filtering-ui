import merge from "lodash/merge";

import ComposableFilters from ".";
import { Condition } from "@/utils/query";
import { mockWindowLocation } from "@/testing";
import {
  defaultComposableFiltersMountOptions,
  mountFactory,
} from "@/testing/helpers";
import {
  exampleQValueOne,
  exampleSchemaTwo,
  exampleSchemaThree,
} from "@/testing/data";

const BLANK_CONDTION = JSON.parse(JSON.stringify(new Condition().toObject()));

describe("Tests ComposableFilters behavior", () => {
  const mountTarget = mountFactory(
    ComposableFilters,
    merge(
      {
        global: { provide: { "debug-enabled": false } },
      },
      defaultComposableFiltersMountOptions,
    ),
  );

  beforeEach((context) => {
    mockWindowLocation();
    context.assignQ = (value) => {
      window.location.search = `?q=${JSON.stringify(value)}`;
    };
  });

  const setConditionRowHtml = async (row, identifier, relative, value) => {
    const cols = row.findAll(".df-ui-col");
    await cols[0].get("select").setValue(identifier);
    await cols[1].get("select").setValue(relative);
    await cols[2].get("input, select").setValue(value);
  };

  test("first visit renders defaults", async (context) => {
    const wrapper = mountTarget();

    // Check the top-level operator defaults to the 'and' state
    const topLevelOp = wrapper.get("#top-level-operator");
    expect(topLevelOp.element.value).toEqual("and");

    // Check that a first row as been populated
    const firstRow = wrapper.findAll(".df-ui-condition")[0];
    expect(firstRow.exists()).toBe(true);

    // Check the 'q' value of the form
    const qInput = wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual('["and",[[null,{}]]]');

    // Check the add button creates a new row
    const addButton = wrapper.get("#add-condition");
    expect(addButton.exists()).toBe(true);

    await addButton.trigger("click");

    // Check a new row was added
    const newRow = wrapper.findAll(".df-ui-condition")[1];
    expect(newRow.exists()).toBe(true);
    // ...which will have added to the q condition value
    expect(qInput.element.value).toEqual('["and",[[null,{}],[null,{}]]]');
  });

  test("adding rows in specific positions", async (context) => {
    const wrapper = mountTarget();

    // Create a few initial rows.
    const row1 = wrapper.findAll(".df-ui-condition")[0];
    const row1Add = row1.get("#add-condition");
    await row1Add.trigger("click");
    await row1Add.trigger("click");

    // Fill in some values so we can tell them apart
    const row2 = wrapper.findAll(".df-ui-condition")[1];
    const row3 = wrapper.findAll(".df-ui-condition")[2];

    const setConditionRowHtmlValue = async (row, value) => {
      await setConditionRowHtml(row, "name", "iexact", value);
    };

    await setConditionRowHtmlValue(row1, "1st");
    await setConditionRowHtmlValue(row2, "2nd");
    await setConditionRowHtmlValue(row3, "3rd");

    // Check we can add a row between the 2nd and 3rd.
    const row2Add = row2.get("#add-condition");
    await row2Add.trigger("click");

    const values = wrapper
      .findAll(".df-ui-condition .df-ui-col:nth-of-type(3) input")
      .map((input) => input.element.value);
    expect(values).toEqual(["1st", "2nd", "", "3rd"]);
  });

  test("removing rows in specific positions", async (context) => {
    const wrapper = mountTarget();

    // Create a few initial rows.
    const row1 = wrapper.findAll(".df-ui-condition")[0];
    const row1Add = row1.get("#add-condition");
    await row1Add.trigger("click");
    await row1Add.trigger("click");

    // Fill in some values so we can tell them apart
    const row2 = wrapper.findAll(".df-ui-condition")[1];
    const row3 = wrapper.findAll(".df-ui-condition")[2];

    const setConditionRowHtmlValue = async (row, value) => {
      await setConditionRowHtml(row, "name", "iexact", value);
    };

    await setConditionRowHtmlValue(row1, "1st");
    await setConditionRowHtmlValue(row2, "2nd");
    await setConditionRowHtmlValue(row3, "3rd");

    // Check we can remove the 2nd row.
    const row2Remove = row2.get("#remove-condition");
    await row2Remove.trigger("click");

    const values = wrapper
      .findAll(".df-ui-condition .df-ui-col:nth-of-type(3) input")
      .map((input) => input.element.value);
    expect(values).toEqual(["1st", "3rd"]);
  });

  test("changing the top-level operator", async (context) => {
    const wrapper = mountTarget();

    // Check the top-level operator defaults to the 'and' state
    const topLevelOp = wrapper.get("#top-level-operator");
    expect(topLevelOp.element.value).toEqual("and");

    // Change the top-level operator
    await topLevelOp.setValue("or");

    // Check the 'q' value of the form
    const qInput = wrapper.get("form > input[name='q']");
    // Note, the first value of the array changed.
    expect(qInput.element.value).toEqual('["or",[[null,{}]]]');
  });

  test("editing filters renders current selection", (context) => {
    const qValue = exampleQValueOne;
    context.assignQ(qValue);
    const wrapper = mountTarget();

    // Check the top-level operator defaults to the 'and' state
    const topLevelOp = wrapper.get("#top-level-operator");
    expect(topLevelOp.element.value).toEqual(qValue[0]);

    // Check that the rows have been populated
    const rows = wrapper.findAll(".df-ui-condition");
    expect(rows.length).toEqual(2);

    // Iterate through the rows looking for matching rendered content.
    // FIXME Stub the ConditionRow so that the content is uniformly rendered for easier matching.
    for (const i in rows) {
      // Look at first select value matches up with "identifier" value.
      expect(
        rows[i].get(".df-ui-col:nth-of-type(1) select").element.value,
      ).toEqual(qValue[1][i][0]);
      // Look at the second select value matching up with the "relative" or lookup value.
      expect(
        rows[i].get(".df-ui-col:nth-of-type(2) select").element.value,
      ).toEqual(qValue[1][i][1].lookup);
      // Match up the third input with the value.
      expect(
        rows[i].get(".df-ui-col:nth-of-type(3) input").element.value,
      ).toEqual(qValue[1][i][1].value);
    }

    // Check the 'q' value of the form
    const qInput = wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual(JSON.stringify(qValue));
  });

  test("cancel returns user to listing page", async (context) => {
    const listingUrl = "/listing";
    const mountOptions = {
      global: {
        provide: {
          "model-listing-url": listingUrl,
        },
      },
    };
    const wrapper = mountTarget(mountOptions);

    const cancelButton = wrapper.get(".cancel");
    await cancelButton.trigger("click");

    expect(window.location.href).toEqual(listingUrl);
  });

  test("editing filters then cancel returns user to listing page", async (context) => {
    const listingUrl = "/listing?bar=foo";
    const qValue = exampleQValueOne;
    context.assignQ(qValue);

    const wrapper = mountTarget({
      global: {
        provide: {
          "model-listing-url": listingUrl,
        },
      },
    });
    // Do an action to mimic editing of the filters
    await wrapper.get("#add-condition").trigger("click");

    // Click the cancel button
    const cancelButton = wrapper.get(".cancel");
    await cancelButton.trigger("click");

    // Check the url has been to the listing url
    expect(window.location.toString()).toEqual(listingUrl);
  });

  test("empty filters submitted, cancels form submission and redirects", async (context) => {
    const listingUrl = "/listing";
    const wrapper = mountTarget({
      global: {
        provide: {
          "model-listing-url": listingUrl,
        },
      },
    });

    // Adding a row for good measure.
    await wrapper.get("#add-condition").trigger("click");

    // Submit the form
    await wrapper.get("form").trigger("submit");

    // Check the url has been to the listing url and the q value remains the same.
    expect(window.location.href).toEqual(listingUrl);
    expect(window.location.search.get("q")).toBe(null);
  });

  test("on submit drops incomplete rows", async (context) => {
    const listingUrl = "/listing";
    const qValue = Array.from(exampleQValueOne);
    context.assignQ(qValue);
    const wrapper = mountTarget({
      global: { provide: { "model-listing-url": listingUrl } },
    });

    // Add a new row, but do not fill it out.
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");
    await wrapper.get("#add-condition").trigger("click");

    // Click submit
    await wrapper.get("form").trigger("submit");

    // Check the 'q' input has dropped the incomplete row
    const qInput = await wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual(JSON.stringify(qValue));
  });

  test("on submit dropping and keeping rows", async (context) => {
    // FIXME This test has been written to work around the lack of input
    //       validation reporting. Instead we simply drop the row for simplicity.
    const listingUrl = "/listing";
    const qValue = [
      "and",
      [
        // Tests when the legitimate value is falsy.
        ["is_family", { lookup: "exact", value: false }],
      ],
    ];
    context.assignQ(qValue);
    const wrapper = mountTarget({
      global: {
        provide: {
          "model-listing-url": listingUrl,
          "filtering-options-schema": exampleSchemaTwo,
        },
      },
    });

    // Add a new row, but do not fill it out.
    await wrapper.get("#add-condition").trigger("click");

    // Add another row that simulates a partially defined condition.
    await wrapper.get("#add-condition").trigger("click");
    const row3 = wrapper.findAll(".df-ui-condition")[2];
    await setConditionRowHtml(row3, "type", "exact");

    // Click submit
    await wrapper.get("form").trigger("submit");

    // Check the 'q' input has dropped the incomplete row
    const qInput = await wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual(JSON.stringify(qValue));
  });

  test.todo("on submit stop on row error", () => {});

  test("on submit ensure sticky condition appears but not with default value", async (context) => {
    const listingUrl = "/listing";
    const stickyDefault = exampleSchemaThree.filters.type.sticky_default;

    const wrapper = mountTarget({
      global: {
        provide: {
          "model-listing-url": listingUrl,
          "filtering-options-schema": exampleSchemaThree,
        },
      },
    });

    // Check the form contains the sticky row with default value.
    expect(wrapper.vm.stickies.length).toBe(1);
    const stickyRow = wrapper.get(".df-ui-condition-sticky");
    expect(
      stickyRow.get(".df-ui-col:nth-of-type(1) select").element.value,
    ).toEqual(stickyDefault[0]);
    expect(
      stickyRow.get(".df-ui-col:nth-of-type(2) select").element.value,
    ).toEqual(stickyDefault[1]["lookup"]);
    expect(
      stickyRow.get(".df-ui-col:nth-of-type(3) select").element.value,
    ).toEqual(stickyDefault[1]["value"]);

    // Check the 'q' value of the form
    const form = wrapper.get("form");
    const qInput = form.get("input[name='q']");
    expect(qInput.element.value).toEqual(
      JSON.stringify(["and", [new Condition().toObject()]]),
    );

    // Trigger submit
    await form.trigger("submit");

    // Check the form submission cancelled,
    // due no new conditions or changes to the sticky condition.
    // Check the url has been to the listing url and the q value remains the same.
    expect(window.location.href).toEqual(listingUrl);
    expect(window.location.search.get("q")).toBe(null);
  });

  test("on submit ensure sticky condition with edited value", async (context) => {
    const listingUrl = "/listing";
    const stickyDefault = exampleSchemaThree.filters.type.sticky_default;

    const wrapper = mountTarget({
      global: {
        provide: {
          "model-listing-url": listingUrl,
          "filtering-options-schema": exampleSchemaThree,
        },
      },
    });

    // Check the form contains the sticky row with default value.
    expect(wrapper.vm.stickies.length).toBe(1);
    const stickyRow = wrapper.get(".df-ui-condition-sticky");

    // Edit the sticky row's value
    const newValue = "any";
    await stickyRow.get(".df-ui-col:nth-of-type(3) select").setValue(newValue);

    // Check for correct form values
    expect(
      stickyRow.get(".df-ui-col:nth-of-type(1) select").element.value,
    ).toEqual(stickyDefault[0]);
    expect(
      stickyRow.get(".df-ui-col:nth-of-type(2) select").element.value,
    ).toEqual(stickyDefault[1]["lookup"]);
    expect(
      stickyRow.get(".df-ui-col:nth-of-type(3) select").element.value,
    ).toEqual(newValue);

    // Check the resulting value has dropped the incomplete row
    const expectedQValue = [
      "and",
      [
        [stickyDefault[0], { ...stickyDefault[1], value: newValue }],
        BLANK_CONDTION,
      ],
    ];

    // Check the 'q' value of the form
    const form = wrapper.get("form");
    const qInput = form.get("input[name='q']");
    expect(JSON.parse(qInput.element.value)).toEqual(expectedQValue);

    // Trigger submit
    await form.trigger("submit");

    // Check the 'q' value of the form after submission
    const expectedQSubmission = [
      "and",
      [[stickyDefault[0], { ...stickyDefault[1], value: newValue }]],
    ];
    expect(JSON.parse(qInput.element.value)).toEqual(expectedQSubmission);
  });
});
