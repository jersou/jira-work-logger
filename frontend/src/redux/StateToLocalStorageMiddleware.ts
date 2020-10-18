import { AppState } from "../types";
import { GetState } from "./slice";

export const localStorageKey = "jira-work-loger-data-state";

function saveStateToLocalStorageKey(state: AppState) {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
}

function createStateToLocalStorageMiddleware() {
  return ({ getState }: { getState: GetState }) => (next: any) => (action: any) => {
    const newState = next(action);
    saveStateToLocalStorageKey(getState());
    return newState;
  };
}

export const stateToLocalStorageMiddleware = createStateToLocalStorageMiddleware();
