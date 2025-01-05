import { Condition, Grouping } from "@/utils/query";

import useSearchParams from "./useSearchParams";

export default (options = {}) => {
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
  let obj = null;
  let originalData = null;
  if (jsonData) {
    obj = Grouping.fromObject(jsonData);
    originalData = jsonData;
  } else if (options.createDefault) {
    // Create a default when the source query filter data doesn't exist.
    obj = new Grouping("and", [new Condition()]);
  }

  return [obj, originalData];
};
