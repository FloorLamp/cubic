import Link from "next/link";
import React from "react";
import { useCubesBalance } from "../../lib/hooks/useCubesBalance";
import { formatNumber } from "../../lib/utils";
import IdentifierLabelWithButtons from "../Buttons/IdentifierLabelWithButtons";
import LoginButton from "../Buttons/LoginButton";
import { TokenLabel } from "../Labels/TokenLabel";
import { useGlobalContext } from "../Store/Store";

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
              <a className="text-right hover:underline">
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
