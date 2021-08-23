import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import React, { createContext, useContext, useReducer } from "react";
import * as Cubic from "../../declarations/Cubic/index";
import * as wtc from "../../declarations/wtc/index";
import * as xtc from "../../declarations/xtc/index";
import { defaultAgent } from "../../lib/canisters";
import { CubicService, WtcService, XtcService } from "../../lib/types";

type State = {
  agent: HttpAgent;
  cubic: CubicService;
  xtc: XtcService;
  wtc: WtcService;
  isAuthed: boolean;
  principal: Principal | null;
  showLoginModal: boolean;
};

const initialState: State = {
  agent: defaultAgent,
  cubic: Cubic.createActor(Cubic.canisterId, defaultAgent),
  xtc: xtc.createActor(xtc.canisterId, defaultAgent),
  wtc: wtc.createActor(wtc.canisterId, defaultAgent),
  isAuthed: false,
  principal: null,
  showLoginModal: false,
};

type Action =
  | {
      type: "SET_AGENT";
      agent: HttpAgent | null;
      isAuthed?: boolean;
    }
  | {
      type: "SET_PRINCIPAL";
      principal: Principal;
    }
  | {
      type: "SET_LOGIN_MODAL";
      open: boolean;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_AGENT":
      const agent = action.agent || defaultAgent;
      return {
        ...state,
        agent,
        cubic: Cubic.createActor(Cubic.canisterId, agent),
        xtc: xtc.createActor(xtc.canisterId, agent),
        wtc: wtc.createActor(wtc.canisterId, agent),
        isAuthed: !!action.isAuthed,
      };
    case "SET_PRINCIPAL":
      return {
        ...state,
        principal: action.principal,
      };
    case "SET_LOGIN_MODAL":
      return {
        ...state,
        showLoginModal: action.open,
      };
  }
};

const Context = createContext({
  state: initialState,
  dispatch: (_: Action) => null,
});

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a CountProvider");
  }
  return context;
};

export const useLoginModal = () => {
  const context = useGlobalContext();
  return [
    context.state.showLoginModal,
    (open: boolean) => context.dispatch({ type: "SET_LOGIN_MODAL", open }),
  ] as const;
};

export const useCubic = () => {
  const context = useGlobalContext();
  return context.state.cubic;
};

export const useXtc = () => {
  const context = useGlobalContext();
  return context.state.xtc;
};

export const useWtc = () => {
  const context = useGlobalContext();
  return context.state.wtc;
};

export const useSetAgent = () => {
  const { dispatch } = useGlobalContext();

  return async ({
    agent,
    isAuthed,
  }: {
    agent: HttpAgent;
    isAuthed?: boolean;
  }) => {
    dispatch({ type: "SET_AGENT", agent, isAuthed });
    if (isAuthed) {
      const principal = await agent.getPrincipal();
      console.log("authed", principal.toText());

      dispatch({
        type: "SET_PRINCIPAL",
        principal,
      });
    } else {
      dispatch({ type: "SET_PRINCIPAL", principal: null });
    }
  };
};

export default Store;
