import merge from "lodash/merge";

import ComposableFilters from ".";
import { mockWindowLocation } from "@/testing";
import {
  defaultComposableFiltersMountOptions,
  mountFactory,
} from "@/testing/helpers";
import { exampleQValueOne } from "@/testing/data";

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

  test("first visit renders defaults", async (context) => {
    const wrapper = mountTarget();

    // Check the top-level operator defaults to the 'and' state
    const topLevelOp = wrapper.get("#top-level-operator");
    expect(topLevelOp.element.value).toEqual("and");

    // Check that a first row as been populated
    const firstRow = wrapper.get("div.row:nth-of-type(2)");
    expect(firstRow.exists()).toBe(true);

    // Check the 'q' value of the form
    const qInput = wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual('["and",[[null,{}]]]');

    // Check the add button creates a new row
    const addButton = wrapper.get("#add-condition");
    expect(addButton.exists()).toBe(true);

    await addButton.trigger("click");

    // Check a new row was added
    const newRow = wrapper.get("div.row:nth-of-type(3)");
    expect(newRow.exists()).toBe(true);
    // ...which will have added to the q condition value
    expect(qInput.element.value).toEqual('["and",[[null,{}],[null,{}]]]');
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

    // Check that a first row as been populated
    const rows = wrapper.findAll(
      "div.row:nth-of-type(2), div.row:nth-of-type(3)",
    );
    // Iterate through the rows looking for matching rendered content.
    // FIXME Stub the ConditionRow so that the content is uniformly rendered for easier matching.
    for (const i in rows) {
      // Look at first select value matches up with "identifier" value.
      expect(rows[i].get(".col:nth-of-type(1) select").element.value).toEqual(
        qValue[1][i][0],
      );
      // Look at the second select value matching up with the "relative" or lookup value.
      expect(rows[i].get(".col:nth-of-type(2) select").element.value).toEqual(
        qValue[1][i][1].lookup,
      );
      // Match up the third input with the value.
      expect(rows[i].get(".col:nth-of-type(3) input").element.value).toEqual(
        qValue[1][i][1].value,
      );
    }

    // Check the 'q' value of the form
    const qInput = wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual(JSON.stringify(qValue));
  });

  test("cancel returns user to listing page", async (context) => {
    const indexUrl = "/listing";
    const mountOptions = {
      global: {
        provide: {
          "model-index-url": indexUrl,
        },
      },
    };
    const wrapper = mountTarget(mountOptions);

    const cancelButton = wrapper.get(".cancel");
    await cancelButton.trigger("click");

    expect(window.location.href).toEqual(indexUrl);
  });

  test("editing filters then cancel returns user to listing page with previous filters", async (context) => {
    const indexUrl = "/listing";
    const qValue = exampleQValueOne;
    context.assignQ(qValue);

    const wrapper = mountTarget({
      global: {
        provide: {
          "model-index-url": indexUrl,
        },
      },
    });

    // FIXME Technically we should edit the query to ensure this works.
    //       Adding a row for now, because that's kinda checking it works.
    await wrapper.get("#add-condition").trigger("click");

    // Click the cancel button
    const cancelButton = wrapper.get(".cancel");
    await cancelButton.trigger("click");

    // Check the url has been to the index url and the q value remains the same.
    expect(window.location.href).toEqual(indexUrl);
    expect(window.location.search.get("q")).toEqual(JSON.stringify(qValue));
  });

  test("empty filters submitted, cancels form submission and redirects", async (context) => {
    const indexUrl = "/listing";
    const wrapper = mountTarget({
      global: {
        provide: {
          "model-index-url": indexUrl,
        },
      },
    });

    // Adding a row for good measure.
    await wrapper.get("#add-condition").trigger("click");

    // Submit the form
    await wrapper.get("form").trigger("submit");

    // Check the url has been to the index url and the q value remains the same.
    expect(window.location.href).toEqual(indexUrl);
    expect(window.location.search.get("q")).toBe(null);
  });

  test("dropping null row(s) on submit", async (context) => {
    const indexUrl = "/listing";
    const qValue = Array.from(exampleQValueOne);
    context.assignQ(qValue);
    const wrapper = mountTarget({
      global: { provide: { "model-index-url": indexUrl } },
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

  test("dropping incomplete row(s) on submit", async (context) => {
    // FIXME This test has been written to work around the lack of black input
    //       validation reporting. Instead we simply drop the row for simplicity.
    const indexUrl = "/listing";
    const qValue = Array.from(exampleQValueOne);
    context.assignQ(qValue);
    const wrapper = mountTarget({
      global: { provide: { "model-index-url": indexUrl } },
    });

    // Add a new row, but do not fill it out.
    await wrapper.get("#add-condition").trigger("click");

    // Click submit
    await wrapper.get("form").trigger("submit");

    // Check the 'q' input has dropped the incomplete row
    const qInput = await wrapper.get("form > input[name='q']");
    expect(qInput.element.value).toEqual(JSON.stringify(qValue));
  });

  test.todo("stop submission on row error", () => {});
});
