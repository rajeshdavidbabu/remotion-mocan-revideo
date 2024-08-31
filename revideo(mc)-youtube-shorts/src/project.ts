import { makeProject } from "@revideo/core";
import shorts from "./scenes/shorts?scene";
import metadata from "./metadata.json";
import "./global.css";

export default makeProject({
  scenes: [shorts],
  variables: metadata,
});
