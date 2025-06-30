import { d as defineEventHandler, g as getQuery } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const mobility_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const bounds = {
    north: Number(query.north) || 25.3,
    south: Number(query.south) || 25.1,
    east: Number(query.east) || 55.4,
    west: Number(query.west) || 55.1
  };
  const data = [];
  for (let i = 0; i < 100; i++) {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west);
    const isCommercial = Math.random() > 0.4;
    const footTraffic = isCommercial ? 200 + Math.floor(Math.random() * 500) : 20 + Math.floor(Math.random() * 100);
    data.push({
      id: `mob_${i}`,
      location: { coordinates: [lng, lat] },
      foot_traffic: footTraffic,
      dwell_time: 5 + Math.floor(Math.random() * 120),
      // 5-125 minutes
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3).toISOString(),
      day_type: Math.random() > 0.3 ? "weekday" : "weekend"
    });
  }
  return {
    success: true,
    data,
    count: data.length
  };
});

export { mobility_get as default };
//# sourceMappingURL=mobility.get.mjs.map
