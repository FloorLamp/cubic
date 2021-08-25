import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { useCubesBalance } from "../../lib/hooks/useCubesBalance";
import { formatNumber } from "../../lib/utils";
import IdentifierLabelWithButtons from "../Buttons/IdentifierLabelWithButtons";
import { TokenLabel } from "../Labels/TokenLabel";
import { useGlobalContext } from "../Store/Store";

const LoginButton = dynamic(() => import("../Buttons/LoginButton"), {
  ssr: false,
});

export default function Nav() {
  const {
    state: { principal },
  } = useGlobalContext();
  const cubesBalance = useCubesBalance();

  return (
    <nav className="py-4 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between border-b border-black border-opacity-10 text-white">
      <div className="flex items-baseline gap-8">
        <Link href="/">
          <a className="text-2xl font-bold uppercase">Cubic</a>
        </Link>

        <Link href="/info">
          <a className="hover:underline">Info</a>
        </Link>

        <Link href="/owners">
          <a className="hover:underline">Owners</a>
        </Link>

        <Link href="/stats">
          <a className="hover:underline">Stats</a>
        </Link>

        <Link href="/minter">
          <a className="hover:underline">Cycles Minter</a>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {principal && !principal.isAnonymous() && (
          <div className="flex flex-col">
            <IdentifierLabelWithButtons
              type="Principal"
              id={principal}
              isShort={true}
              showName={false}
            />

            <Link href={`/cubes`}>
              <a className="justify-end hover:underline inline-flex items-center">
                <strong>
                  {cubesBalance.isSuccess
                    ? formatNumber(cubesBalance.data)
                    : "—"}
                </strong>{" "}
                <TokenLabel />
              </a>
            </Link>
          </div>
        )}
        <LoginButton />
      </div>
    </nav>
  );
}
