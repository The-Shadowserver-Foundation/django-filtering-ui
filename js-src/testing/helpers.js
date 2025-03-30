import { mount } from "@vue/test-utils";
import merge from "lodash/merge";
import { exampleSchemaOne } from "./data";

export const defaultComposableFiltersMountOptions = {
  global: {
    provide: {
      "model-filtering-url": "https://example.com/filtering/",
      "model-listing-url": "https://example.com",
      "filtering-options-schema": exampleSchemaOne,
      // Not currently in use, but injected.
      "filtering-json-schema": {},
    },
  },
};

export function mountFactory(component, predefinedOptions) {
  // Factory for creating a `mount` with predefined target component.
  // The idea is to use the factory to produce a function that can be used
  // throughout the test suite.
  //
  // General usage would be to place the resulting function in the context
  //   context.mount = mountTargetFactory(TargetComponent);
  // And then use it within the test like:
  //   const wrapper = context.mount();
  return (options) => {
    const o = {};
    merge(o, predefinedOptions, options);
    return mount(component, o);
  };
}
