import { d as defineEventHandler, a as getRouterParam, g as getQuery, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _type__get = defineEventHandler(async (event) => {
  const type = getRouterParam(event, "type");
  const query = getQuery(event);
  if (!["mobility", "spending", "opportunity"].includes(type || "")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid heatmap type"
    });
  }
  const bounds = {
    north: Number(query.north) || 25.3,
    south: Number(query.south) || 25.1,
    east: Number(query.east) || 55.4,
    west: Number(query.west) || 55.1
  };
  const data = generateMockHeatmapData(type, bounds, 500);
  return {
    success: true,
    type,
    data,
    bounds,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
});
function generateMockHeatmapData(type, bounds, count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west);
    let intensity = Math.random();
    switch (type) {
      case "mobility":
        if (Math.random() > 0.6) {
          intensity = 0.6 + Math.random() * 0.4;
        } else {
          intensity = Math.random() * 0.5;
        }
        break;
      case "spending":
        if (Math.random() > 0.7) {
          intensity = 0.5 + Math.random() * 0.5;
        } else {
          intensity = Math.random() * 0.4;
        }
        break;
      case "opportunity":
        intensity = 0.3 + Math.random() * 0.7;
        break;
    }
    data.push({
      lat,
      lng,
      intensity,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3).toISOString()
    });
  }
  return data;
}

export { _type__get as default };
//# sourceMappingURL=_type_.get.mjs.map
