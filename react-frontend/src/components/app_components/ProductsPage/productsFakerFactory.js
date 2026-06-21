
import { faker } from "@faker-js/faker";
export default (user,count,categoryIds,brandIds,packingIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.lorem.sentence(""),
serialNo: faker.lorem.sentence(""),
category: categoryIds[i % categoryIds.length],
brand: brandIds[i % brandIds.length],
packing: packingIds[i % packingIds.length],

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
