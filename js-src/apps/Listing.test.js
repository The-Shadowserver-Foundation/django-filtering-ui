import { mount } from "@vue/test-utils";
import Listing from "./Listing.vue";

import { mockWindowLocation } from "@/testing";
import { exampleQValueOne } from "@/testing/data";
import { mountTargetFactory } from "@/testing/helpers";

describe("testing high-level lozenge interface rendering", () => {
  beforeEach((context) => {
    mockWindowLocation();
    context.assignQ = (value) => {
      window.location.search = `?q=${JSON.stringify(value)}`;
    };

    context.mount = mountTargetFactory(Listing);
  });
  test("renders a simple query", (context) => {
    context.assignQ(exampleQValueOne);
    const wrapper = context.mount();

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
});
