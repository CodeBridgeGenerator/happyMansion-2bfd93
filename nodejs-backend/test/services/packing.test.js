const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("packing service", async () => {
  let thisService;
  let packingCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("packing");

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
    assert.ok(thisService, "Registered the service (packing)");
  });

  describe("#create", () => {
    const options = {"type":"new value"};

    beforeEach(async () => {
      packingCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new packing", () => {
      assert.strictEqual(packingCreated.type, options.type);
    });
  });

  describe("#get", () => {
    it("should retrieve a packing by ID", async () => {
      const retrieved = await thisService.Model.findById(packingCreated._id);
      assert.strictEqual(retrieved._id.toString(), packingCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"type":"updated value"};

    it("should update an existing packing ", async () => {
      const packingUpdated = await thisService.Model.findByIdAndUpdate(
        packingCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(packingUpdated.type, options.type);
    });
  });

  describe("#delete", async () => {
    it("should delete a packing", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const packingDeleted = await thisService.Model.findByIdAndDelete(packingCreated._id);
      assert.strictEqual(packingDeleted._id.toString(), packingCreated._id.toString());
    });
  });
});