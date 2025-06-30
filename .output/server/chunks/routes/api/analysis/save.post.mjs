import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const save_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.geometry || !body.investmentType || !body.investmentAmount || !body.result) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields"
    });
  }
  const analysisRecord = {
    id: `analysis_${Date.now()}`,
    geometry: body.geometry,
    investment_type: body.investmentType,
    investment_amount: body.investmentAmount,
    crop_types: body.cropTypes || null,
    analysis_result: body.result,
    created_at: (/* @__PURE__ */ new Date()).toISOString()};
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    analysis_id: analysisRecord.id,
    message: "Analysis saved successfully"
  };
});

export { save_post as default };
//# sourceMappingURL=save.post.mjs.map
