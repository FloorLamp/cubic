import { HttpAgent, Identity, SignIdentity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import PlugConnect from "@psychedelic/plug-connect";
import { StoicIdentity } from "ic-stoic-identity";
import React, { useEffect, useState } from "react";
import { canisterId as CubicCanisterId } from "../../declarations/Cubic";
import { canisterId as LedgerCanisterId } from "../../declarations/ledger";
import { canisterId as WtcCanisterId } from "../../declarations/wtc";
import { canisterId as XtcCanisterId } from "../../declarations/xtc";
import { HOST, IDENTITY_PROVIDER } from "../../lib/canisters";
import { ONE_WEEK_NS } from "../../lib/constants";
import Modal from "../Layout/Modal";
import { useGlobalContext, useLoginModal, useSetAgent } from "../Store/Store";

declare global {
  interface Window {
    ic: {
      plug: {
        agent: any;
        isConnected: () => Promise<boolean>;
        createAgent: (args?: {
          whitelist: string[];
          host?: string;
        }) => Promise<undefined>;
        requestBalance: () => Promise<
          Array<{
            amount: number;
            canisterId: string | null;
            image: string;
            name: string;
            symbol: string;
            value: number | null;
          }>
        >;
        requestTransfer: (arg: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: number;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>;
      };
    };
  }
}

const WHITELIST = [
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local" && LedgerCanisterId, // only request perms for ledger if local
  CubicCanisterId,
  XtcCanisterId,
  WtcCanisterId,
].filter(Boolean);

export default function LoginButton() {
  const [isOpen, setIsOpen] = useLoginModal();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const {
    state: { isAuthed },
  } = useGlobalContext();
  const setAgent = useSetAgent();
  const [authClient, setAuthClient] = useState<AuthClient>(null);

  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity: Identity = authClient.getIdentity();
    setAgent({
      agent: new HttpAgent({
        identity,
        host: HOST,
      }),
      isAuthed: true,
    });
    closeModal();
  };

  const [showIILogin, setShowIILogin] = useState(false);
  const handleIILogin = async () => {
    authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      maxTimeToLive: ONE_WEEK_NS,
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const handleIILogout = async () => {
    await authClient.logout();
    setAgent({ agent: null });
  };

  const handlePlugLogin = async () => {
    setAgent({
      agent: await window?.ic?.plug?.agent,
      isAuthed: true,
    });
    closeModal();
  };

  const [showStoicLogin, setShowStoicLogin] = useState(false);
  const handleStoicLogin = async () => {
    StoicIdentity.load().then(async (identity: SignIdentity) => {
      if (!identity) {
        identity = await StoicIdentity.connect();
      }
      setAgent({
        agent: new HttpAgent({
          identity,
          host: HOST,
        }),
        isAuthed: true,
      });
      closeModal();
    });
  };

  const handleLogout = async () => {
    if (await window?.ic?.plug?.isConnected()) {
      window.ic.plug.agent = null;
      setAgent({ agent: null });
      if (!authClient) {
        const authClient = await AuthClient.create();
        setAuthClient(authClient);
      }
    } else {
      handleIILogout();
    }
  };

  // Auth on refresh
  useEffect(() => {
    (async () => {
      if (await window?.ic?.plug?.isConnected()) {
        if (!window.ic.plug.agent) {
          await window.ic.plug.createAgent({
            whitelist: WHITELIST,
            host: HOST,
          });
        }
        handlePlugLogin();
      } else {
        const authClient = await AuthClient.create();
        setAuthClient(authClient);
        if (await authClient.isAuthenticated()) {
          handleAuthenticated(authClient);
        }
      }
    })();
  }, []);

  return (
    <>
      <button
        className="px-2 py-1 rounded-md bg-transparent border-2 border-white opacity-70 hover:opacity-100 transition-opacity"
        onClick={isAuthed ? handleLogout : openModal}
      >
        {isAuthed ? "Logout" : "Login"}
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Login"
        className="max-w-xs w-full"
      >
        <div className="flex flex-col items-stretch gap-4">
          {showIILogin && (
            <div className="text-sm">
              Internet Identity is not recommended due to difficulty in holding
              balances across different apps.
              <div className="flex mt-4 gap-2 leading-none">
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-200 border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={() => setShowIILogin(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 flex justify-center items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={handleIILogin}
                >
                  <img src="/img/dfinity.png" className="w-4 mr-2" /> Login
                </button>
              </div>
            </div>
          )}

          {showStoicLogin && (
            <div className="text-sm">
              Stoic requires third-party cookies to connect.
              <ul className="list-disc mt-2 pl-5">
                <li>
                  <strong>Brave</strong> — Disable shields for cubic.place
                </li>
                <li>
                  <strong>Safari</strong> — Enable cross-site tracking
                </li>
              </ul>
              <div className="flex mt-4 gap-2 leading-none">
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-200 border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={() => setShowStoicLogin(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 flex justify-center items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={handleStoicLogin}
                >
                  <img src="/img/stoic.png" className="w-4 mr-2" /> Login
                </button>
              </div>
            </div>
          )}

          {!showIILogin && !showStoicLogin && (
            <>
              <PlugConnect
                whitelist={WHITELIST}
                host={HOST}
                onConnectCallback={handlePlugLogin}
              />

              <button
                className="flex items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                onClick={() => setShowStoicLogin(!showStoicLogin)}
              >
                <img src="/img/stoic.png" className="w-4 mr-2" /> Stoic
              </button>

              <button
                className="flex items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                onClick={() => setShowIILogin(!showIILogin)}
              >
                <img src="/img/dfinity.png" className="w-4 mr-2" /> Internet
                Identity
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
