import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

test("old game links redirect permanently while preserving nested paths and queries", async () => {
  for (const [suffix, expected] of [["", "/"], ["/", "/"], ["/players/", "/players/"], ["/audio/water-splash.wav?v=1", "/audio/water-splash.wav?v=1"]]) {
    const response = await worker.fetch(new Request(`https://claudiaochoa.co/games/chaising-birdies${suffix}`), {}, {});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), `https://claudiaochoa.co/games/chasing-birdies${expected}`);
  }
});
