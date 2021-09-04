import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import React, { createContext, useContext, useReducer } from "react";
import { Block, HistoryResponse } from "../../declarations/Cubic/Cubic.did";
import * as Cubic from "../../declarations/Cubic/index";
import * as ledger from "../../declarations/ledger/index";
import * as wtc from "../../declarations/wtc/index";
import * as xtc from "../../declarations/xtc/index";
import { defaultAgent } from "../../lib/canisters";
import {
  CubicService,
  LedgerService,
  ParsedStatus,
  WtcService,
  XtcService,
} from "../../lib/types";

export type State = {
  agent: HttpAgent;
  cubic: CubicService;
  xtc: XtcService;
  wtc: WtcService;
  ledger: LedgerService;
  isAuthed: boolean;
  principal: Principal | null;
  showLoginModal: boolean;
  mockData: {
    active: boolean;
    status: ParsedStatus;
    transfers: HistoryResponse;
    art: Block[];
    now: bigint;
  };
};

export const INITIAL_MOCK_STATE = {
  active: true,
  transfers: { transfers: [], count: BigInt(0) },
  art: [],
  status: {
    status: {
      owner: null,
      offerValue: 1,
      offerTimestamp: BigInt(0),
    },
    artId: "0",
    owner: null,
  },
  now: BigInt(0),
};

const initialState: State = {
  agent: defaultAgent,
  cubic: Cubic.createActor(defaultAgent),
  xtc: xtc.createActor(defaultAgent),
  wtc: wtc.createActor(defaultAgent),
  ledger: ledger.createActor(defaultAgent),
  isAuthed: false,
  principal: null,
  showLoginModal: false,
  mockData: INITIAL_MOCK_STATE,
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
    }
  | {
      type: "SET_MOCK_DATA";
      data: State["mockData"];
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_AGENT":
      const agent = action.agent || defaultAgent;
      return {
        ...state,
        agent,
        cubic: Cubic.createActor(agent),
        xtc: xtc.createActor(agent),
        wtc: wtc.createActor(agent),
        ledger: ledger.createActor(agent),
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
    case "SET_MOCK_DATA":
      return {
        ...state,
        mockData: action.data,
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

export const useLedger = () => {
  const context = useGlobalContext();
  return context.state.ledger;
};

export const useMockData = () => {
  const context = useGlobalContext();
  return [
    context.state.mockData,
    (data: State["mockData"]) =>
      context.dispatch({ type: "SET_MOCK_DATA", data }),
  ] as const;
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
