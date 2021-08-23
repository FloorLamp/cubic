import React from "react";
import { BlocksTable } from "../components/BlocksTable";

export default function OwnersPage() {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <BlocksTable />
    </div>
  );
}
