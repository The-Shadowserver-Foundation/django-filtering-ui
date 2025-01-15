import Listing from "./Listing.vue";

import { mockWindowLocation } from "@/testing";
import { exampleQValueOne, exampleSchemaTwo } from "@/testing/data";
import {
  defaultComposableFiltersMountOptions,
  mountFactory,
} from "@/testing/helpers";
import { merge } from "lodash";

describe("testing high-level lozenge interface rendering", () => {
  const mountTarget = mountFactory(Listing);

  const assignQ = (value) => {
    window.location.search = `?q=${JSON.stringify(value)}`;
  };

  beforeEach(() => {
    mockWindowLocation();
  });

  test("renders a simple query", () => {
    assignQ(exampleQValueOne);
    const wrapper = mountTarget(defaultComposableFiltersMountOptions);

    // Check the preamble text renders 'any'
    // for the `or` operator in the query data.
    expect(wrapper.get(".preamble").text()).toBe("Results match any of:");

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
    for (const i in lozenges) {
      // Destructure the expected values
      const [identifier, { lookup, value }] = exampleQValueOne[1][i];
      // Check the target component element for the expected data.
      const loz = lozenges[i];
      expect(loz.get(".identifier").attributes("data-value")).toBe(identifier);
      expect(loz.get(".relative").attributes("data-value")).toBe(lookup);
      expect(loz.get(".value").attributes("data-value")).toBe(value);
    }
  });

  test("renders with a choice type lookup", () => {
    const qValue = ["or", [["type", { lookup: "exact", value: "tool" }]]];
    assignQ(qValue);
    const wrapper = mountTarget(
      merge(
        { ...defaultComposableFiltersMountOptions },
        {
          global: { provide: { "filtering-options-schema": exampleSchemaTwo } },
        },
      ),
    );

    const lozenges = wrapper.findAllComponents({ name: "Lozenge" });
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
});
