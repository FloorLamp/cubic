import React from "react";
import Panel from "../components/Containers/Panel";
import { TokenLabel } from "../components/Labels/TokenLabel";
import { homeDescription, MetaTags } from "../components/MetaTags";
import { useInfo } from "../lib/hooks/useInfo";
import { formatPercent } from "../lib/utils";

export default function InfoPage() {
  const { data } = useInfo();
  return (
    <div className="py-8">
      <MetaTags title="Info" image="hero" description={homeDescription} />
      <Panel className="w-full p-8 flex flex-col gap-4">
        <h1 className="text-3xl">What is Cubic?</h1>
        <p>
          Cubic is a generative art project. Data such as ownership history and
          transaction history are used in different ways to generate unique
          canvases in a variety of styles.
        </p>
        <p>
          Styles range from slower and subtly-evolving, to highly dynamic and
          ephemeral. The unique properties of the Internet Computer enable a
          whole new medium of ownable interactive experiences.
        </p>
        <p>
          Ownership is based on a{" "}
          <a
            className="underline cursor-pointer"
            href="https://medium.com/@simondlr/what-is-harberger-tax-where-does-the-blockchain-fit-in-1329046922c6"
            target="_blank"
            rel="noreferrer"
          >
            Harberger Tax
          </a>{" "}
          system.
        </p>
        <h3 className="text-xl">Taxes?</h3>
        <p>
          When purchasing an artwork, you will need to set a new offer price —
          but don't set this too high! You will be charged a tax based on this
          price
          {data &&
            ` (currently ${formatPercent(
              Number(data.stats.annualTaxRate) / 1e8
            )} annual)`}
          , which is deducted automatically from your CUBE balance.
        </p>
        <p>
          If you don't have enough CUBE to pay tax, your Cubic will be{" "}
          <strong>foreclosed</strong>! You will forfeit ownership and anyone
          will be able to purchase it at the starting price.
        </p>
        <h3 className="text-xl">
          <TokenLabel />
        </h3>
        <p>
          You will need CUBE to make purchases. 1 CUBE is equivalent to 1
          Trillion Cycles — the unit of compute that power the Internet
          Computer.
        </p>
        <div>
          You can swap with:{" "}
          <ul className="list-disc pl-5">
            <li>
              <a
                className="underline cursor-pointer"
                href="https://www.wtctoken.com/"
                target="_blank"
                rel="noreferrer"
              >
                WTC
              </a>{" "}
              from ToniqLabs
            </li>
            <li>
              <a
                className="underline cursor-pointer"
                href="https://dank.ooo/xtc/"
                target="_blank"
                rel="noreferrer"
              >
                XTC
              </a>{" "}
              from Fleek
            </li>
            <li>
              <a
                className="underline cursor-pointer"
                href="https://sdk.dfinity.org/docs/developers-guide/default-wallet.html"
                target="_blank"
                rel="noreferrer"
              >
                Raw Cycles
              </a>{" "}
              using cycles-wallet
            </li>
          </ul>
        </div>

        <h3 className="text-xl">For Artists and Creatives</h3>
        <p>
          cubic.place is open to all creative coders, from beginners to p5js
          veterans. Please{" "}
          <a
            className="underline"
            href="https://t.me/joinchat/jozeWC4qZGxjYzRh"
            target="_blank"
          >
            get in touch
          </a>{" "}
          if you'd like to contribute.
        </p>
      </Panel>
    </div>
  );
}
