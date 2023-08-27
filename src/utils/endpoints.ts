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
  CREATE = "/product",
  UPDATE = "/product/:id",
  REMOVE = "/product/:id",
}
