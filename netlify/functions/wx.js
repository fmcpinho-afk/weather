// Netlify serverless function: fetches real METARs and TAFs from the
// Aviation Weather Center and returns them keyed by ICAO. Runs server-side,
// so the browser never has to deal with cross-origin restrictions.
//
// No npm dependencies: Netlify's Node runtime (18+) has global fetch built in.

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=600", // 10 min; aviation wx doesn't change faster than that
  };

  const ids = (event.queryStringParameters && event.queryStringParameters.ids || "")
    .split(",").map(s => s.trim().toUpperCase()).filter(Boolean);

  if (!ids.length) {
    return { statusCode: 200, headers, body: "{}" };
  }

  const list = ids.join(",");
  const metarUrl = "https://aviationweather.gov/api/data/metar?ids=" + list + "&format=json";
  const tafUrl   = "https://aviationweather.gov/api/data/taf?ids="   + list + "&format=json";

  const out = {};
  const ensure = k => (out[k] = out[k] || { metar: null, taf: null, fcsts: null });

  try {
    const [mRes, tRes] = await Promise.all([fetch(metarUrl), fetch(tafUrl)]);

    if (mRes.ok) {
      const metars = await mRes.json().catch(() => []);
      (Array.isArray(metars) ? metars : []).forEach(m => {
        const k = (m.icaoId || "").toUpperCase();
        if (k) ensure(k).metar = m.rawOb || m.rawMETAR || null;
      });
    }

    if (tRes.ok) {
      const tafs = await tRes.json().catch(() => []);
      (Array.isArray(tafs) ? tafs : []).forEach(t => {
        const k = (t.icaoId || "").toUpperCase();
        if (!k) return;
        const e = ensure(k);
        e.taf = t.rawTAF || null;
        // Keep only the decoded fields we actually use, to keep the payload small.
        e.fcsts = (t.fcsts || []).map(f => ({
          from: f.timeFrom, to: f.timeTo,
          wspd: f.wspd, wgst: f.wgst,
          visib: f.visib,
          wx: f.wxString || null,
          clouds: (f.clouds || []).map(c => ({ cover: c.cover, base: c.base })),
        }));
      });
    }

    return { statusCode: 200, headers, body: JSON.stringify(out) };
  } catch (err) {
    // Fail soft: an empty object just means the page uses the model fallback.
    return { statusCode: 200, headers, body: "{}" };
  }
};
