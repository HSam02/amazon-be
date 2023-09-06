export default (orders: any) =>
  orders.map((order: any) => ({
    id: order.id,
    address: order.address,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    products: order.products.map((product: any) => ({
      id: product.OrdersProducts.id,
      name: product.name,
      price: product.OrdersProducts.price,
      quantity: product.OrdersProducts.quantity,
      defaultImg: product.defaultImg,
      size: product.OrdersProducts.size,
      color: product.OrdersProducts.color,
    })),
  }));
