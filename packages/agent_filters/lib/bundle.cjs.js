"use strict";var e=require("ajv"),t=require("graphai"),r=require("@noble/hashes/sha2");const a=(t,r)=>{if(!(new e).compile(t)(r))throw new Error("schema not matched");return!0};const n=async(e,t,r,a)=>{const n=async function*(e,t){const{params:r,namedInputs:a,debugInfo:n,filterParams:s}=t,o={params:r,debugInfo:n,filterParams:s,namedInputs:a},i=await fetch(e,{headers:{"Content-Type":"text/event-stream"},method:"POST",body:JSON.stringify(o)}),c=i.body?.getReader();if(200!==i.status||!c)throw new Error("Request failed");const u=new TextDecoder("utf-8");let l=!1;for(;!l;){const{done:e,value:t}=await c.read();if(e)l=e,c.releaseLock();else{const e=u.decode(t,{stream:!0});yield e}}}(t,r),s=[];for await(const t of n)a&&console.log(t),t&&(s.push(t),-1===s.join("").indexOf("___END___")&&e.filterParams.streamTokenCallback&&e.filterParams.streamTokenCallback(t));const o=s.join("").split("___END___")[1];return JSON.parse(o)},s=e=>Array.isArray(e)?e.map((e=>s(e))):t.isObject(e)?Object.keys(e).sort().reduce(((t,r)=>(t[r]=e[r],t)),{}):e,o=e=>{const{namedInputs:t,params:a,debugInfo:n}=e,{agentId:o}=n,i=r.sha256(JSON.stringify(s({namedInputs:t,params:a,agentId:o})));return btoa(String.fromCharCode(...i))};exports.agentFilterRunnerBuilder=e=>{const t=e;return(e,r)=>{let a=0;const n=e=>{const s=t[a++];return s?s.agent(e,n):r(e)};return n(e)}},exports.agentInputValidator=a,exports.cacheAgentFilterGenerator=e=>{const{getCache:t,setCache:r,getCacheKey:a}=e;return async(e,n)=>{if("pureAgent"===e.cacheType){const s=a?a(e):o(e),i=await t(s);if(i)return i;const c=await n(e);return await r(s,c),c}return"impureAgent"===e.cacheType&&(e.filterParams.cache={getCache:t,setCache:r,getCacheKey:o}),n(e)}},exports.httpAgentFilter=async(e,t)=>{const{params:r,debugInfo:a,filterParams:s,namedInputs:o}=e;if(s?.server){const{baseUrl:t,isDebug:i,serverAgentUrlDictionary:c}=s.server,u=a.agentId,l=void 0!==s.streamTokenCallback,d=c&&u&&c[u]?c[u]:[t,u].join("/");void 0===d&&console.log("httpAgentFilter: Url is not defined");const p={params:r,debugInfo:a,filterParams:s,namedInputs:o,inputs:o};return l?await n(e,d,p,i):await(async(e,t)=>{const r=await fetch(e,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});return await r.json()})(d,p)}return t(e)},exports.namedInputValidatorFilter=async(e,t)=>{const{inputSchema:r,namedInputs:n}=e;return r&&"array"!==r.type&&a(r,n||{}),t(e)},exports.sortObjectKeys=s,exports.streamAgentFilterGenerator=e=>async(t,r)=>(t.debugInfo.isResult&&(t.filterParams.streamTokenCallback=r=>{e(t,r)}),r(t));
//# sourceMappingURL=bundle.cjs.js.map
