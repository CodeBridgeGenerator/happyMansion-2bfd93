const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("category service", async () => {
  let thisService;
  let categoryCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("category");

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
    assert.ok(thisService, "Registered the service (category)");
  });

  describe("#create", () => {
    const options = {"name":"new value"};

    beforeEach(async () => {
      categoryCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new category", () => {
      assert.strictEqual(categoryCreated.name, options.name);
    });
  });

  describe("#get", () => {
    it("should retrieve a category by ID", async () => {
      const retrieved = await thisService.Model.findById(categoryCreated._id);
      assert.strictEqual(retrieved._id.toString(), categoryCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"name":"updated value"};

    it("should update an existing category ", async () => {
      const categoryUpdated = await thisService.Model.findByIdAndUpdate(
        categoryCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(categoryUpdated.name, options.name);
    });
  });

  describe("#delete", async () => {
    it("should delete a category", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const categoryDeleted = await thisService.Model.findByIdAndDelete(categoryCreated._id);
      assert.strictEqual(categoryDeleted._id.toString(), categoryCreated._id.toString());
    });
  });
});