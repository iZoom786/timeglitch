module.exports = [
"[externals]/node-fetch [external] (node-fetch, esm_import, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_node-fetch_c4b67b8c._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/node-fetch [external] (node-fetch, esm_import)");
    });
});
}),
];