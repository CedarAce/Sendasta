// lib/hqAuth.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkBasicAuth } from "./hqAuth.mjs";

const header = (user, pass) =>
  "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

test("accepts the correct password regardless of username", () => {
  assert.equal(checkBasicAuth(header("admin", "s3cret"), "s3cret"), true);
  assert.equal(checkBasicAuth(header("", "s3cret"), "s3cret"), true);
});

test("rejects wrong password, missing header, and unset password", () => {
  assert.equal(checkBasicAuth(header("admin", "nope"), "s3cret"), false);
  assert.equal(checkBasicAuth(undefined, "s3cret"), false);
  assert.equal(checkBasicAuth("Bearer xyz", "s3cret"), false);
  assert.equal(checkBasicAuth(header("admin", "s3cret"), ""), false);
});
