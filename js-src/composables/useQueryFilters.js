import { computed, ref } from "vue";
import { Condition, Grouping } from "@/utils/query";

import useSearchParams from "./useSearchParams";

const extractStickyConditions = (grouping, optionsSchema) => {
  const stickies = [];
  for (const [name, schema] of Object.entries(optionsSchema.filters).filter(
    ([n, s]) => s.is_sticky,
  )) {
    const foundConditions = grouping.conditions.filter(
      (c) => c.identifier === name,
    );
    if (foundConditions.length > 0) {
      const found = foundConditions[0];
      stickies.push(found);
    } else {
      stickies.push(
        new Condition(
          schema.sticky_default[0],
          schema.sticky_default[1]["lookup"],
          schema.sticky_default[1]["value"],
        ),
      );
    }
  }
  // Remove these conditions from the main list of contitions
  grouping.removeConditions(...stickies);
  return stickies;
};

const getAllStickyDefaults = (optionsSchema) => {
  const stickies = [];
  for (const [name, schema] of Object.entries(optionsSchema.filters).filter(
    ([n, s]) => s.is_sticky,
  )) {
    stickies.push(
      new Condition(
        schema.sticky_default[0],
        schema.sticky_default[1]["lookup"],
        schema.sticky_default[1]["value"],
      ),
    );
  }
  return stickies;
};

export default (options = {}) => {
  const { optionsSchema } = options;
  if (typeof optionsSchema === "undefined") {
    throw Error("must supply the options schema");
  }

  const params = useSearchParams();
  // Get the 'q' parameter value
  const jsonString = params.get("q");

  let jsonData = null;
  // Check if the 'q' parameter exists and is not empty
  if (jsonString) {
    try {
      // Parse the JSON string
      jsonData = JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  // Create object from data
  let grouping = null;
  let stickies = [];
  let original = null;
  if (jsonData) {
    grouping = Grouping.fromObject(jsonData);
    stickies = extractStickyConditions(grouping, optionsSchema);
    if (grouping.conditions.length == 0 && options.createDefault) {
      grouping.addConditions(new Condition());
    }
    original = jsonData;
  } else {
    if (options.createDefault) {
      // Create a default when the source query filter data doesn't exist.
      grouping = new Grouping("and", [new Condition()]);
    } else {
      grouping = new Grouping("and");
    }
    stickies = getAllStickyDefaults(optionsSchema);
  }
  stickies = ref(stickies);

  const changedStickies = computed(() => {
    const nonDefaultStickies = [];
    if (stickies.value.length > 0) {
      for (const c of stickies.value) {
        const stickyDefault =
          optionsSchema.filters[c.identifier].sticky_default;
        if (
          c.relative !== stickyDefault[1]["lookup"] ||
          c.value !== stickyDefault[1]["value"]
        ) {
          nonDefaultStickies.push(c);
        }
      }
    }
    return nonDefaultStickies;
  });

  // Computes the query into the end result for form submission.
  const rendered = computed(() => {
    const q = grouping.toObject();
    // Prepend the sticky conditions.
    // This is so they will be popped off correctly when read again from this component, etc.
    for (const c of changedStickies.value.toReversed()) {
      q[1].unshift(c.toObject());
    }
    return JSON.stringify(q);
  });

  return { grouping, stickies, changedStickies, original, rendered };
};
