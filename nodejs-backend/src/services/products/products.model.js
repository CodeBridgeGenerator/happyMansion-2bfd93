
    module.exports = function (app) {
        const modelName = "products";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            name: { type:  String , comment: "Name, p, false, true, true, true, true, true, true, , , , ," },
serialNo: { type:  String , comment: "Serial No, p, false, true, true, true, true, true, true, , , , ," },
category: { type: Schema.Types.ObjectId, ref: "category", comment: "Category, dropdown, false, true, true, true, true, true, true, category, category, one-to-one, name," },
brand: { type: Schema.Types.ObjectId, ref: "brand", comment: "Brand, dropdown, false, true, true, true, true, true, true, brand, brand, one-to-one, name:company," },
packing: { type: Schema.Types.ObjectId, ref: "packing", comment: "Packing, dropdown, false, true, true, true, true, true, true, packing, packing, one-to-one, type," },
weight: { type: [Schema.Types.ObjectId], ref: "weight", description: "isArray", comment: "Weight, multiselect, false, true, true, true, true, true, true, weight, weight, one-to-many, amount:unit," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };