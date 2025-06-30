import { d as defineEventHandler, g as getQuery } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ewallet_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const bounds = {
    north: Number(query.north) || 25.3,
    south: Number(query.south) || 25.1,
    east: Number(query.east) || 55.4,
    west: Number(query.west) || 55.1
  };
  const categories = ["Food & Dining", "Shopping", "Entertainment", "Services", "Transport"];
  const merchantTypes = ["restaurant", "cafe", "retail", "grocery", "service"];
  const data = [];
  for (let i = 0; i < 150; i++) {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west);
    data.push({
      id: `ewallet_${i}`,
      location: { coordinates: [lng, lat] },
      amount: 10 + Math.random() * 490,
      // $10-500
      category: categories[Math.floor(Math.random() * categories.length)],
      merchant_type: merchantTypes[Math.floor(Math.random() * merchantTypes.length)],
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3).toISOString()
    });
  }
  return {
    success: true,
    data,
    count: data.length
  };
});

export { ewallet_get as default };
//# sourceMappingURL=ewallet.get.mjs.map
