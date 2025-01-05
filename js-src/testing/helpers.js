import { mount } from "@vue/test-utils";
import merge from "lodash/merge";

export const exampleSchemaOne = {
  operators: {},
  filters: {
    name: {
      type: "field",
      field_type: "string",
      lookups: ["iexact"],
      label: "Name",
    },
    description: {
      type: "field",
      field_type: "string",
      lookups: ["icontains", "iendswith", "istartswith"],
      label: "Description",
    },
  },
};

export const defaultComponentMountOptions = {
  global: {
    provide: {
      "model-index-url": "https://example.com",
      "filtering-options-schema": exampleSchemaOne,
      // Not currently in use, but injected.
      "filtering-json-schema": {},
    },
  },
};

export function mountTargetFactory(component) {
  // Factory for creating a `mount` with predefined target component.
  // The idea is to use the factory to produce a function that can be used
  // throughout the test suite.
  //
  // General usage would be to place the resulting function in the context
  //   context.mount = mountTargetFactory(TargetComponent);
  // And then use it within the test like:
  //   const wrapper = context.mount();
  return (options) => {
    return mount(component, merge(defaultComponentMountOptions, options));
  };
}
