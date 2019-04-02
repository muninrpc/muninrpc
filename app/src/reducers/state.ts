import { MainModel } from "../models/MainModel";

export interface RootState {
  main: RootState.mainState;
}

export namespace RootState {
  export type mainState = MainModel;
}
