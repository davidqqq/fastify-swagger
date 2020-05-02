const Fastify = require("fastify");

const Ajv = require("ajv");
const ajv = new Ajv({
  coerceTypes: false
});

const manufacturer = {
  name: "ACME Corporation",
  homePage: "https://www.acme-corp.com",
  phone: "408-867-5309"
};

const inventory = {
  id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  name: "Widget Adapter",
  releaseDate: "2016-08-29T09:12:33.001Z",
  manufacturer: manufacturer
};

function buildFastify() {
  const fastify = Fastify();
  ajv.addSchema({
    $id: "http://example.com/",
    type: "object",
    properties: {
      hello: { type: "string" }
    }
  });

  fastify.setSchemaCompiler(schema => ajv.compile(schema));
  fastify.setSchemaResolver(ref => {
    return ajv.getSchema(ref).schema;
  });

  fastify.get("/inventory", {
    schema: {
      querystring: {
        searchString: { type: "string" }
      }
    },
    handler(request, reply) {
      reply.send([inventory]);
    }
  });

  fastify.post("/inventory", {
    schema: {
      body: {
        type: "object",
        required: ["id", "manufacturer", "name", "releaseDate"],
        properties: {
          id: {
            type: "string"
            // format: "uuid",
            // example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
          },
          name: {
            type: "string"
            // example: "Widget Adapter"
          },
          releaseDate: {
            type: "string"
            // format: "date-time",
            // example: "2016-08-29T09:12:33.001Z"
          }
        }
      }
    },
    handler(request, reply) {
      reply.status(201).send({
        message: "item created"
      });
    }
  });

  return fastify;
}

module.exports = buildFastify;
