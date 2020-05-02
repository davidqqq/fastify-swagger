const tap = require("tap");
const buildFastify = require("./app");

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

const fastify = buildFastify();
require("tap").mochaGlobals();
const should = require("should");
describe("Inventory endpoint", () => {
  after(() => {
    fastify.close();
  });
  context("GET `/inventory` route", () => {
    it("gets inventory", () => {
      fastify.inject(
        {
          method: "GET",
          url: "/inventory"
        },
        (err, response) => {
          if (err) {
            console.log(err);
            return;
          }
          response.statusCode.should.equal(200);
          response.headers["content-type"].should.equal(
            "application/json; charset=utf-8"
          );
          // t.error(err);
          response.json().should.be.an.Array();
          response.json().should.deepEqual([inventory]);
        }
      );
    });

    it("failed to create inventory due to invalid parameteres ['id', 'manufacturer', 'name', 'releaseDate']", () => {
      fastify.inject(
        {
          method: "POST",
          url: "/inventory",
          payload: {}
        },
        (err, response) => {
          response.json().statusCode.should.equal(400);
          response
            .json()
            .message.should.equal(
              "body should have required property '.manufacturer'"
            );
        }
      );
      fastify.inject(
        {
          method: "POST",
          url: "/inventory",
          payload: {
            id: 1,
            name: "1",
            releaseDate: "1",
            manufacturer: manufacturer
          }
        },
        (err, response) => {
          response.json().statusCode.should.equal(400);
          response.json().message.should.equal("body.id should be string");
        }
      );
    });

    it("creates an inventory given valid 'id' || 'manufacturer' || 'name' || 'releaseDate'", () => {
      fastify.inject(
        {
          method: "POST",
          url: "/inventory",
          payload: inventory
        },
        (err, response) => {
          response.statusCode.should.equal(201);
          response.json().message.should.equal("item created");
        }
      );
    });
  });
});
