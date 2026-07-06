/**
 * @param {unknown} payload
 * @returns {{ id: string, email: string, name: string } | null}
 */
export function parseAdminProfile(payload) {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    return null;
  }

  const data = payload.data;

  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    !("email" in data) ||
    typeof data.id !== "string" ||
    data.id.length === 0 ||
    data.id.length > 128 ||
    typeof data.email !== "string" ||
    data.email.length === 0 ||
    data.email.length > 254
  ) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name:
      "name" in data && typeof data.name === "string" && data.name.length <= 100
        ? data.name
        : "Admin",
  };
}

/** @param {unknown} payload */
export function parseLoginToken(payload) {
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    return null;
  }

  const data = payload.data;

  return data &&
    typeof data === "object" &&
    "token" in data &&
    typeof data.token === "string" &&
    data.token.length > 0 &&
    data.token.length <= 4096
    ? data.token
    : null;
}

/** @param {string | undefined} value */
export function normalizeApiUrl(value) {
  return value?.trim().replace(/\/+$/, "") || null;
}
