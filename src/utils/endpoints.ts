export enum authEndpoints {
  REGISTER = "/auth/register",
  LOGIN = "/auth/login",
  GET_ME = "/auth/me",
  CHECK_EMAIL = "/auth/check/:email",
  VERIFY = "/auth/verify/:email",
  CHANGE_PASSWORD = "/auth/change",
  SET_DEFAULT_ADDRESS = "/auth/set-address/:id",
}

export enum sizeEndpoints {
  GET_ALL = "/size",
  CREATE = "/size",
  UPDATE = "/size/:id",
  REMOVE = "/size/:id",
}

export enum colorEndpoints {
  GET_ALL = "/color",
  CREATE = "/color",
  UPDATE = "/color/:id",
  REMOVE = "/color/:id",
}

export enum categoryEndpoints {
  GET_ALL = "/category",
  CREATE = "/category",
  UPDATE = "/category/:id",
  REMOVE = "/category/:id",
}

export enum addressEndpoints {
  GET_ALL = "/address",
  CREATE = "/address",
  UPDATE = "/address/:id",
  REMOVE = "/address/:id",
}

export enum productEndpoints {
  GET_ALL = "/product",
  GET_MY = "/product/my",
  CREATE = "/product",
  UPDATE = "/product/:id",
  REMOVE = "/product/:id",
}

export enum cartEndpoints {
  GET_MY = "/cart",
  CREATE = "/cart",
  UPDATE = "/cart/:id",
  REMOVE = "/cart/:id",
}

export enum buyLaterEndpoints {
  GET_MY = "/buylater",
  CREATE = "/buylater",
  REMOVE = "/buylater/:id",
}

export enum orderEndpoints {
  GET_MY = "/order",
  CREATE = "/order",
}

export enum paymentEndpoints {
  CREATE = "/create-payment-intent",
  WEBHOOK = "/stripe-webhook",
}
