import React from "react";
import { History } from "../../../components/History";
import { OwnersTable } from "../../../components/OwnersTable";

export default function OwnersPage() {
  return (
    <div className="flex flex-col items-center gap-8 pt-8">
      <OwnersTable />

      <History />
    </div>
  );
}
