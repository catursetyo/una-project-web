import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeApiUrl,
  parseAdminProfile,
  parseLoginToken,
} from "./adminAuth.mjs";

test("parses only the safe admin DTO and login token", () => {
  assert.deepEqual(
    parseAdminProfile({
      data: {
        id: "admin-1",
        email: "admin@unaproject.my.id",
        name: "UNA Admin",
        password_hash: "must-not-leak",
      },
    }),
    {
      id: "admin-1",
      email: "admin@unaproject.my.id",
      name: "UNA Admin",
    },
  );
  assert.equal(parseAdminProfile({ data: { id: 1 } }), null);
  assert.equal(parseLoginToken({ data: { token: "signed-token" } }), "signed-token");
  assert.equal(parseLoginToken({ data: {} }), null);
  assert.equal(parseLoginToken({ data: { token: "x".repeat(4097) } }), null);
  assert.equal(normalizeApiUrl(" http://localhost:8080/v1/ "), "http://localhost:8080/v1");
});
