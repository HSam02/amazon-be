import db from "./";
import userModelFunction from "./user";
import sizeModelFunction from "./size";
import colorModelFunction from "./color";
import categoryModelFunction from "./category";
import addressModelFunction from "./address";
import productModelFunction from "./product";
import imageModelFunction from "./image";

export const User: ReturnType<typeof userModelFunction> = db.User;
export const Color: ReturnType<typeof colorModelFunction> = db.Color;
export const Size: ReturnType<typeof sizeModelFunction> = db.Size;
export const Category: ReturnType<typeof categoryModelFunction> = db.Category;
export const Address: ReturnType<typeof addressModelFunction> = db.Address;
export const Product: ReturnType<typeof productModelFunction> = db.Product;
export const Image: ReturnType<typeof imageModelFunction> = db.Image;

Address.addHook("beforeDestroy", async (instance: any) => {
  const user = await db.User.findByPk(instance.userId);
  if (user?.defaultAddressId === instance.id) {
    user.defaultAddressId = null;
    await user.save();
  }
});

Category.addHook("beforeDestroy", async (instance: any) => {
  const product = await Product.findOne({
    where: { categoryId: instance.id },
  });
  if (product) {
    product.categoryId = null;
    await product.save();
  }
});

Image.addHook("beforeDestroy", async (instance: any) => {
  const product = await Product.findByPk(instance.productId);
  if (product && product.defaultImageId === instance.id) {
    product.defaultImageId = null;
    product.isAvailable = false;
    await product.save();
  }
});
