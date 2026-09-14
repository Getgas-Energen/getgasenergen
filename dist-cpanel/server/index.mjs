globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, b as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": '"10db8-MPdjAmiTS7ikh0i9xZx6/NxjZsc"',
    "mtime": "2026-09-14T19:48:29.412Z",
    "size": 69048,
    "path": "../client/favicon.ico"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"aa-ChNmKb974LCqFOv4pvm5cUugRII"',
    "mtime": "2026-09-14T19:48:29.412Z",
    "size": 170,
    "path": "../client/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": '"4bb-sKtI+DqA6vfMLHQKmAKcpQPeCNY"',
    "mtime": "2026-09-14T19:48:29.412Z",
    "size": 1211,
    "path": "../client/sitemap.xml"
  },
  "/assets/admin.functions-CVzfJmdf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"510-StqP2FT2D9QC3/zL4i3Higl7TzQ"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 1296,
    "path": "../client/assets/admin.functions-CVzfJmdf.js"
  },
  "/assets/SectionHeading-DkxOTnii.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"252-DBgoDp93TK5kzzl/4Q95FhTniAA"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 594,
    "path": "../client/assets/SectionHeading-DkxOTnii.js"
  },
  "/assets/about-CFV8AhwP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17db-CPKyrJtYV7iFOH5MP3HxtGDU0tY"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 6107,
    "path": "../client/assets/about-CFV8AhwP.js"
  },
  "/assets/arrow-left-D5w2u87P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-w3SorLbg8OdOp1/1JRf6qPInpvs"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 166,
    "path": "../client/assets/arrow-left-D5w2u87P.js"
  },
  "/assets/building-2-DACVF0Tp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"180-U4+n+wvTEDmEgPXRRd41xHhwA/Y"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 384,
    "path": "../client/assets/building-2-DACVF0Tp.js"
  },
  "/assets/arrow-right-prRgOcwc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-VyAHTN51GIHWbvfIIs4JxAamQ6E"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 166,
    "path": "../client/assets/arrow-right-prRgOcwc.js"
  },
  "/assets/circle-check-Dt0rG6hN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ae-0BqDnl4RjLAQcwCmeO7wdCZ0Evs"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 174,
    "path": "../client/assets/circle-check-Dt0rG6hN.js"
  },
  "/assets/calendar-days-BgRNOF38.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"26b-mVkBttreZTX91mVr9g+CVNzAqtQ"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 619,
    "path": "../client/assets/calendar-days-BgRNOF38.js"
  },
  "/assets/console-DUblfApS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d42-AhYP334Wo6LpjDW4/5qLcg1TGX8"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 3394,
    "path": "../client/assets/console-DUblfApS.js"
  },
  "/assets/console.posts-Cs2aeraY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"df3-s9EUejMivJsulw6azvk/if2JsrM"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 3571,
    "path": "../client/assets/console.posts-Cs2aeraY.js"
  },
  "/assets/console.index-C6xOu-nM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e9e-+vE5ATm4UMS2LF5Pz864yDRmrAA"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 3742,
    "path": "../client/assets/console.index-C6xOu-nM.js"
  },
  "/assets/console.posts._id-D6qpruP0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16c8-S9mO2OtFfeBgIIC87dp7Jt8SJmg"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 5832,
    "path": "../client/assets/console.posts._id-D6qpruP0.js"
  },
  "/assets/console.users-DS9mxiDa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11f4-9oGD7Fw43sIrvygP4dvAymGxVhY"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 4596,
    "path": "../client/assets/console.users-DS9mxiDa.js"
  },
  "/assets/contact-BGSXVWQs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1be6-wUb1yZTjS7EjaTYdaUOZMinGp2s"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 7142,
    "path": "../client/assets/contact-BGSXVWQs.js"
  },
  "/assets/cpu-Ch8LUjYm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"283-GqJ9/32fyl35XDM1J1NgmHzjv2E"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 643,
    "path": "../client/assets/cpu-Ch8LUjYm.js"
  },
  "/assets/gauge--kJiGVw2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b1-uK91L1TXfW7QFRwF7fgnGfa/d4E"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 177,
    "path": "../client/assets/gauge--kJiGVw2.js"
  },
  "/assets/flame-BWRSGih9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c3-tc2EwSHgdvdb809E6qzVVrOUUDs"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 195,
    "path": "../client/assets/flame-BWRSGih9.js"
  },
  "/assets/index-BuZbSu1C.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3a55-TqFVE+2IpGdsuGtiPVGVStSPiVo"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 14933,
    "path": "../client/assets/index-BuZbSu1C.js"
  },
  "/assets/hero-storage-DamOe9Ki.jpg": {
    "type": "image/jpeg",
    "etag": '"2d630-iErTCWJzEoQDUyjZecS+KxaDD0U"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 185904,
    "path": "../client/assets/hero-storage-DamOe9Ki.jpg"
  },
  "/assets/insights-CzpyT4e4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fb-tiMzKXGFAAozwgLq+HyUdunsjrw"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 251,
    "path": "../client/assets/insights-CzpyT4e4.js"
  },
  "/assets/industries-g36q5Hh1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"104e-3EMjuSmH0Fa6YGFzJauEFr/JCmw"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 4174,
    "path": "../client/assets/industries-g36q5Hh1.js"
  },
  "/assets/index-DEMA0Sbd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a95bf-xR/5VrsWQFAsllz6UfIHN1ZoL84"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 693695,
    "path": "../client/assets/index-DEMA0Sbd.js"
  },
  "/assets/insights-DP0SfZCH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d23-mzlJ0YMfmQlkZeFpUt0/0vrhFac"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 3363,
    "path": "../client/assets/insights-DP0SfZCH.js"
  },
  "/assets/insights-Dw2E2-KO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"164-PkKcbWNLv42YTW3rFKyWvZ/I7lM"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 356,
    "path": "../client/assets/insights-Dw2E2-KO.js"
  },
  "/assets/insights._slug-CbJJPF9p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17c-dU9u4Iu+xRnkY2NMyfwa6n9uqFM"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 380,
    "path": "../client/assets/insights._slug-CbJJPF9p.js"
  },
  "/assets/insights._slug-DWtQNzJu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5e8-btXJEfDAmULnBxL0YHy7+Xe4KZM"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 1512,
    "path": "../client/assets/insights._slug-DWtQNzJu.js"
  },
  "/assets/insights._slug-Ku8uc63N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17d-mh1gYDfzry6igtHq43+FS8WwHC4"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 381,
    "path": "../client/assets/insights._slug-Ku8uc63N.js"
  },
  "/assets/label-Bq596crx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"560-+lKOr42LZibRObmcHQru7BFoHXo"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 1376,
    "path": "../client/assets/label-Bq596crx.js"
  },
  "/assets/marketplace-W-LjPkh7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"144c-+WZRglyaIiXgxHh5w5SnccCLMP8"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 5196,
    "path": "../client/assets/marketplace-W-LjPkh7.js"
  },
  "/assets/power-D3_Xi8Aq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ae-3hPnL9+hOAEYgaCozxEVB/GPzVo"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 174,
    "path": "../client/assets/power-D3_Xi8Aq.js"
  },
  "/assets/project-commercial-8zb5J0dC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d4-NHPjkHaV0zuTD1qID8adJa0MHas"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 212,
    "path": "../client/assets/project-commercial-8zb5J0dC.js"
  },
  "/assets/project-residential-Hio1ITe5.jpg": {
    "type": "image/jpeg",
    "etag": '"2dcbb-4KVFwFJunaQ8zQfAGr+e/s2M9dk"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 187579,
    "path": "../client/assets/project-residential-Hio1ITe5.jpg"
  },
  "/assets/radar-DRa-pIkT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f7-tqfIeZYnYwSR2Q7E+puiBlE2w8c"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 503,
    "path": "../client/assets/radar-DRa-pIkT.js"
  },
  "/assets/project-manifold-BWe2mjkz.jpg": {
    "type": "image/jpeg",
    "etag": '"1a187-Ael/Psbn6unjFlT9Q215qLZpZO4"',
    "mtime": "2026-09-14T19:48:27.356Z",
    "size": 106887,
    "path": "../client/assets/project-manifold-BWe2mjkz.jpg"
  },
  "/assets/projects-Dy3XjIiF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d0f-k5+ThK1ptrGldHYA8U7hqb2uUAs"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 3343,
    "path": "../client/assets/projects-Dy3XjIiF.js"
  },
  "/assets/project-commercial-Bn7zq_dq.jpg": {
    "type": "image/jpeg",
    "etag": '"1b0ee-AdQGP3BZ/KgvLiHRbpC1cagQl8o"',
    "mtime": "2026-09-14T19:48:27.356Z",
    "size": 110830,
    "path": "../client/assets/project-commercial-Bn7zq_dq.jpg"
  },
  "/assets/reset-password-D0VwO9ZH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"611-PqNeQdqFRdaCrDjUi6v1UCnEdIo"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 1553,
    "path": "../client/assets/reset-password-D0VwO9ZH.js"
  },
  "/assets/safety-systems-B1Inz8w7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16ab-YKXvEXyaKGUfvRmyY2MTGKB6QDs"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 5803,
    "path": "../client/assets/safety-systems-B1Inz8w7.js"
  },
  "/assets/route-D0_umLk-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5f-DbOP0jhm/CkKPMSRU3/K2OA4C3c"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 95,
    "path": "../client/assets/route-D0_umLk-.js"
  },
  "/assets/select-DOxS29fT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"cd65-CuRCWizQ+50XObnnmU9IsKnsVYk"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 52581,
    "path": "../client/assets/select-DOxS29fT.js"
  },
  "/assets/shield-check-hhu9BR7S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"13c-bIKlpqyDypc2dbFTIvkf2AeMw+I"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 316,
    "path": "../client/assets/shield-check-hhu9BR7S.js"
  },
  "/assets/staff-login-DoOh7LxJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a7f-tB+tz7qmVXdwdtnjm3FcSA3cvhE"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 2687,
    "path": "../client/assets/staff-login-DoOh7LxJ.js"
  },
  "/assets/stethoscope-CXDdxJE1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8f2-j1cN9VdMPqpEdS5PNNHcJOOyPsI"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 2290,
    "path": "../client/assets/stethoscope-CXDdxJE1.js"
  },
  "/assets/services-eZK1cG_o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1369-DxMaEUewiL/LzAwE/1rTcPJpEGM"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 4969,
    "path": "../client/assets/services-eZK1cG_o.js"
  },
  "/assets/smart-metering-HAtjDSs9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1744-ujF4Eig7ADAAtvLDPUlekNrRSv0"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 5956,
    "path": "../client/assets/smart-metering-HAtjDSs9.js"
  },
  "/assets/styles-DITD_WKk.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"1628f-oCvqngbXYfaUrk7nVaI9MeW2nS0"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 90767,
    "path": "../client/assets/styles-DITD_WKk.css"
  },
  "/assets/textarea-jrib1b6z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1c7-UhBK8YuI9aI5GkRDtm0P91JYxe4"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 455,
    "path": "../client/assets/textarea-jrib1b6z.js"
  },
  "/assets/wrench-CJVUH0uV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"12b-93VLZ7jSE5C9tjxQChdKHHx+QX8"',
    "mtime": "2026-09-14T19:48:27.357Z",
    "size": 299,
    "path": "../client/assets/wrench-CJVUH0uV.js"
  },
  "/assets/users-Dgupm6Bn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"133-LdZqmUKN4lLil6rBSAn35vH0k6U"',
    "mtime": "2026-09-14T19:48:27.358Z",
    "size": 307,
    "path": "../client/assets/users-Dgupm6Bn.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _attSPk = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_j21Qvj = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_j21Qvj };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_attSPk)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    middleware.push(...h3App["~middleware"]);
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
