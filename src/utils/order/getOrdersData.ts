export default (orders: any) =>
  orders.map((order: any) => ({
    id: order.id,
    address: order.address,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    products: order.products.map((product: any) => ({
      id: product.OrdersProducts.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.OrdersProducts.price,
      deletedAt: product.deletedAt,
      quantity: product.OrdersProducts.quantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      defaultImg: product.defaultImg,
      images: product.images,
      size: product.OrdersProducts.size,
      color: product.OrdersProducts.color,
    })),
  }));
