const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("weight service", async () => {
  let thisService;
  let weightCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("weight");

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
    assert.ok(thisService, "Registered the service (weight)");
  });

  describe("#create", () => {
    const options = {"amount":"new value","unit":"new value"};

    beforeEach(async () => {
      weightCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new weight", () => {
      assert.strictEqual(weightCreated.amount, options.amount);
assert.strictEqual(weightCreated.unit, options.unit);
    });
  });

  describe("#get", () => {
    it("should retrieve a weight by ID", async () => {
      const retrieved = await thisService.Model.findById(weightCreated._id);
      assert.strictEqual(retrieved._id.toString(), weightCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"amount":"updated value","unit":"updated value"};

    it("should update an existing weight ", async () => {
      const weightUpdated = await thisService.Model.findByIdAndUpdate(
        weightCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(weightUpdated.amount, options.amount);
assert.strictEqual(weightUpdated.unit, options.unit);
    });
  });

  describe("#delete", async () => {
    it("should delete a weight", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const weightDeleted = await thisService.Model.findByIdAndDelete(weightCreated._id);
      assert.strictEqual(weightDeleted._id.toString(), weightCreated._id.toString());
    });
  });
});