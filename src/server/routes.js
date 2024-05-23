const handler = require("./handler.js");

const routes = [
  {
    method: "POST",
    path: "/predict",
    handler: handler.predikHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1 * 1024 * 1024,
      },
    },
  },
  {
    method: "GET",
    path: "/predict/histories",
    handler: handler.RiwayatHandler,
  },
  {
    method: "*",
    path: "/{any*}",
    handler: handler.notfoundHandler,
  },
];

module.exports = routes;
