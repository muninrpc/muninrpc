export * from "./mainActions";
export * from "./mainRequestActions";
import { mainActions } from "./mainActions";
import { mainRequestActions } from "./mainRequestActions";

export const actions = { ...mainActions, ...mainRequestActions };
export type actions = typeof mainActions & typeof mainRequestActions;
