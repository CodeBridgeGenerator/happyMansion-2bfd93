const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("products service", async () => {
  let thisService;
  let productCreated;
  let usersServiceResults;
  let users;

  const categoryCreated = await app.service("category").Model.create({"name":"new value","serialNo":"new value","category":"parentObjectId"});
const brandCreated = await app.service("brand").Model.create({"name":"new value","serialNo":"new value","category":`${categoryCreated._id}`,"brand":"parentObjectId","company":"parentObjectId"});
const packingCreated = await app.service("packing").Model.create({"name":"new value","serialNo":"new value","category":`${categoryCreated._id}`,"brand":`${brandCreated._id}`,"company":"parentObjectId","packing":"parentObjectId","type":"new value"});
const weightCreated = await app.service("weight").Model.create({"name":"new value","serialNo":"new value","category":`${categoryCreated._id}`,"brand":`${brandCreated._id}`,"company":"parentObjectId","packing":`${packingCreated._id}`,"type":"new value","weight":"parentObjectId","amount":"new value","unit":"new value"});

  beforeEach(async () => {
    thisService = await app.service("products");

    // Create users here
    usersServiceResults = await app.service("users").Model.create(usersRefData);
    users = {
      createdBy: usersServiceResults[0]._id,
      updatedBy: usersServiceResults[0]._id,
    };
  });

  after(async () => {
    if (usersServiceResults) {
      await Promise.all(
        usersServiceResults.map((i) =>
          app.service("users").Model.findByIdAndDelete(i._id)
        )
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (products)");
  });

  describe("#create", () => {
    const options = {"name":"new value","serialNo":"new value","category":`${categoryCreated._id}`,"brand":`${brandCreated._id}`,"company":"parentObjectId","packing":`${packingCreated._id}`,"type":"new value","weight":`${weightCreated._id}`,"amount":"new value","unit":"new value"};

    beforeEach(async () => {
      productCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new product", () => {
      assert.strictEqual(productCreated.name, options.name);
assert.strictEqual(productCreated.serialNo, options.serialNo);
assert.strictEqual(productCreated.category.toString(), options.category.toString());
assert.strictEqual(productCreated.brand.toString(), options.brand.toString());
assert.strictEqual(productCreated.packing.toString(), options.packing.toString());
assert.strictEqual(productCreated.weight.toString(), options.weight.toString());
    });
  });

  describe("#get", () => {
    it("should retrieve a product by ID", async () => {
      const retrieved = await thisService.Model.findById(productCreated._id);
      assert.strictEqual(retrieved._id.toString(), productCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"name":"updated value","serialNo":"updated value","category":`${categoryCreated._id}`,"brand":`${brandCreated._id}`,"packing":`${packingCreated._id}`,"weight":`${weightCreated._id}`};

    it("should update an existing product ", async () => {
      const productUpdated = await thisService.Model.findByIdAndUpdate(
        productCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(productUpdated.name, options.name);
assert.strictEqual(productUpdated.serialNo, options.serialNo);
assert.strictEqual(productUpdated.category.toString(), options.category.toString());
assert.strictEqual(productUpdated.brand.toString(), options.brand.toString());
assert.strictEqual(productUpdated.packing.toString(), options.packing.toString());
assert.strictEqual(productUpdated.weight.toString(), options.weight.toString());
    });
  });

  describe("#delete", async () => {
    it("should delete a product", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("category").Model.findByIdAndDelete(categoryCreated._id);
await app.service("brand").Model.findByIdAndDelete(brandCreated._id);
await app.service("packing").Model.findByIdAndDelete(packingCreated._id);
await app.service("weight").Model.findByIdAndDelete(weightCreated._id);;

      const productDeleted = await thisService.Model.findByIdAndDelete(productCreated._id);
      assert.strictEqual(productDeleted._id.toString(), productCreated._id.toString());
    });
  });
});