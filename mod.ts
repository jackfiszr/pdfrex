export * from "./merge.ts";
export * from "./split.ts";
export * from "./totxt.ts";
import { main } from "./cli.ts";

if (import.meta.main) {
  main();
}
