const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("brand service", async () => {
  let thisService;
  let brandCreated;
  let usersServiceResults;
  let users;

  

  beforeEach(async () => {
    thisService = await app.service("brand");

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
    assert.ok(thisService, "Registered the service (brand)");
  });

  describe("#create", () => {
    const options = {"name":"new value","company":"parentObjectId"};

    beforeEach(async () => {
      brandCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new brand", () => {
      assert.strictEqual(brandCreated.name, options.name);
assert.strictEqual(brandCreated.company.toString(), options.company.toString());
    });
  });

  describe("#get", () => {
    it("should retrieve a brand by ID", async () => {
      const retrieved = await thisService.Model.findById(brandCreated._id);
      assert.strictEqual(retrieved._id.toString(), brandCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"name":"updated value","company":`${companiesCreated._id}`};

    it("should update an existing brand ", async () => {
      const brandUpdated = await thisService.Model.findByIdAndUpdate(
        brandCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(brandUpdated.name, options.name);
assert.strictEqual(brandUpdated.company.toString(), options.company.toString());
    });
  });

  describe("#delete", async () => {
    it("should delete a brand", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      ;

      const brandDeleted = await thisService.Model.findByIdAndDelete(brandCreated._id);
      assert.strictEqual(brandDeleted._id.toString(), brandCreated._id.toString());
    });
  });
});