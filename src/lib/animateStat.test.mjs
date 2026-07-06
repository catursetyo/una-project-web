import assert from "node:assert/strict";
import { getAnimatedStatValue } from "./animateStat.mjs";

assert.equal(getAnimatedStatValue(100, 0.5), "50");
assert.equal(getAnimatedStatValue("GPS", 0.5), "GP");
assert.equal(getAnimatedStatValue(0, 0), "9");
assert.equal(getAnimatedStatValue(0, 1), "0");

console.log("animateStat checks passed");
