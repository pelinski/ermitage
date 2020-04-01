import React from "react";
import { withProtected } from "../lib/protectRoute.hoc"

const Page = () => (
  <div>
    <h1> This is dashboard</h1>
  </div>
);
export const DashboardPage = withProtected(Page);
