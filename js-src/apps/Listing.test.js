import { vi } from "vitest";
import Listing from "./Listing.vue";

import { mockWindowLocation } from "@/testing";
import {
  exampleQValueOne,
  exampleSchemaTwo,
  exampleSchemaThree,
  exampleSchemaFour,
} from "@/testing/data";
import {
  defaultComposableFiltersMountOptions,
  mountFactory,
} from "@/testing/helpers";

describe("testing high-level lozenge interface rendering", () => {
  const mountTarget = mountFactory(
    Listing,
    defaultComposableFiltersMountOptions,
  );

  const assignQ = (value) => {
    window.location.search = `?q=${JSON.stringify(value)}`;
  };

  beforeEach(() => {
    mockWindowLocation();
  });

  test("renders a simple query", () => {
    assignQ(exampleQValueOne);
    const wrapper = mountTarget();

    // Check the preamble text renders 'any'
    // for the `or` operator in the query data.
    expect(wrapper.get(".preamble").text()).toBe("Results match any of:");

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toEqual(exampleQValueOne[1].length);
    for (const i in lozenges) {
      // Destructure the expected values
      const [identifier, { lookup, value }] = exampleQValueOne[1][i];
      // Check the target component element for the expected data.
      const loz = lozenges[i];
      expect(loz.get(".identifier").attributes("data-value")).toBe(identifier);
      expect(loz.get(".relative").attributes("data-value")).toBe(lookup);
      expect(loz.get(".value").attributes("data-value")).toBe(value);
    }

    // Renders the underlying form used to convey changes
    const form = wrapper.get("form");
    expect(form.attributes("method")).toEqual("post");
    expect(form.attributes("action")).toEqual(
      defaultComposableFiltersMountOptions.global.provide[
        "model-filtering-url"
      ],
    );
    expect(JSON.parse(form.get('input[name="q"]').element.value)).toEqual(
      exampleQValueOne,
    );
  });

  test("renders with a choice type lookup", () => {
    const qValue = ["or", [["type", { lookup: "exact", value: "tool" }]]];
    assignQ(qValue);
    const wrapper = mountTarget({
      global: { provide: { "filtering-options-schema": exampleSchemaTwo } },
    });

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toEqual(qValue[1].length);
    for (const i in lozenges) {
      // Destructure the expected values
      const [identifier, { lookup, value }] = qValue[1][i];
      // Check the target component element for the expected data.
      const loz = lozenges[i];
      expect(loz.get(".identifier").attributes("data-value")).toBe(identifier);
      expect(loz.get(".relative").attributes("data-value")).toBe(lookup);
      expect(loz.get(".value").attributes("data-value")).toBe(value);
    }
  });

  test("removal of all conditions submits no conditions", async () => {
    // In this case, we let the serverside form logic strip the q completely from the request.
    const qValue = ["or", [["type", { lookup: "exact", value: "tool" }]]];
    assignQ(qValue);
    const wrapper = mountTarget({
      global: { provide: { "filtering-options-schema": exampleSchemaTwo } },
    });

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toEqual(qValue[1].length);
    const loz = lozenges[0];

    await loz.get("a.clear").trigger("click");

    // Check form submission value
    const qInput = wrapper.get("form").get('input[name="q"]');
    // Expect the q to contain no conditions
    const expectedQSubmission = ["or", []];
    expect(JSON.parse(qInput.element.value)).toEqual(expectedQSubmission);
  });

  test("removal of condition submits query data", async () => {
    const qValue = [
      "or",
      [
        ["name", { lookup: "icontains", value: "eco" }],
        ["name", { lookup: "icontains", value: "green" }],
      ],
    ];
    assignQ(qValue);
    const wrapper = mountTarget({
      global: { provide: { "filtering-options-schema": exampleSchemaFour } },
    });

    // Attach an event listener to the form's submit event,
    // so that we ensure the submit event triggers.
    const form = wrapper.get("form");
    const submitListener = vi.fn();
    form.element.addEventListener("submit", submitListener);

    // Look for the lozenges (2 sticky + 2 from the user supplied conditions)
    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toEqual(2 + qValue[1].length);
    // Look at the first user input lozenge (note, the 2 sticky lozenges before it).
    const loz = lozenges[2];

    // Trigger the removal of the lozenge
    await loz.get("a.clear").trigger("click");

    // Check form submission event triggered
    expect(submitListener).toHaveBeenCalled();

    // Check form submission value
    const qInput = form.get('input[name="q"]');
    // Expect the q value to have dropped the removed lozenge's data.
    const expectedQSubmission = ["or", [qValue[1][1]]];
    expect(JSON.parse(qInput.element.value)).toEqual(expectedQSubmission);
  });

  test("renders with a default sticky condition", () => {
    const wrapper = mountTarget({
      global: {
        provide: { "filtering-options-schema": exampleSchemaThree },
      },
    });

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toBe(1);
    // Destructure the expected values
    const [identifier, { lookup, value }] =
      exampleSchemaThree.filters.type.sticky_default;
    // Check the target component element for the expected data.
    const loz = lozenges[0];
    expect(loz.get(".identifier").attributes("data-value")).toBe(identifier);
    expect(loz.get(".relative").attributes("data-value")).toBe(lookup);
    expect(loz.get(".value").attributes("data-value")).toBe(value);
    // Check the removal button is not present
    expect(loz.find("a.clear").exists()).toBe(false);
  });

  test("renders with a non-default sticky condition and other condition", () => {
    const qValue = [
      "or",
      [
        ["type", { lookup: "exact", value: "any" }],
        ["is_family", { lookup: "exact", value: "true" }],
      ],
    ];
    assignQ(qValue);
    const wrapper = mountTarget({
      global: {
        provide: { "filtering-options-schema": exampleSchemaThree },
      },
    });

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toEqual(qValue[1].length);
    const expectedValues = [
      {
        identifier: qValue[1][0][0],
        relative: qValue[1][0][1].lookup,
        value: qValue[1][0][1].value,
        exists: true,
      },
      {
        identifier: qValue[1][1][0],
        relative: qValue[1][1][1].lookup,
        value: qValue[1][1][1].value,
        exists: true,
      },
    ];
    for (const i in lozenges) {
      // Destructure the expected values
      const desired = expectedValues[i];
      // Check the target component element for the expected data.
      const loz = lozenges[i];
      expect(loz.get(".identifier").attributes("data-value")).toBe(
        desired.identifier,
      );
      expect(loz.get(".relative").attributes("data-value")).toBe(
        desired.relative,
      );
      expect(loz.get(".value").attributes("data-value")).toBe(desired.value);
      expect(loz.find("a.clear").exists()).toBe(desired.exists);
    }
  });

  test("reset sticky condition with other condition", async () => {
    const qValue = [
      "or",
      [
        ["type", { lookup: "exact", value: "any" }],
        ["is_family", { lookup: "exact", value: "true" }],
      ],
    ];
    assignQ(qValue);
    const wrapper = mountTarget({
      global: {
        provide: { "filtering-options-schema": exampleSchemaThree },
      },
    });

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    expect(lozenges.length).toEqual(qValue[1].length);

    const loz = lozenges[0];
    // Verify we are looking at the correct lozenge
    expect(loz.vm.condition.identifier).toEqual("type");
    // Reset the sticky condition
    await loz.find("a.clear").trigger("click");

    // Check form submission value
    const qInput = wrapper.get("form").get('input[name="q"]');
    // Expect the q to contain only the remaining condition
    const expectedQSubmission = ["or", [qValue[1][1]]];
    expect(JSON.parse(qInput.element.value)).toEqual(expectedQSubmission);
  });
});
