import React from "react";
import { withProtected } from "../lib/protectRoute.hoc"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import GridLayout, { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

const MyResponsiveGrid = () => {

  // {lg: layout1, md: layout2, ...}
  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 }];
  return (
    <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
      <div key="a" style={{ border: "1px solid red" }}>a</div>
      <div key="b" style={{ border: "1px solid red" }}>b</div>
      <div key="c" style={{ border: "1px solid red" }}>c</div>
    </GridLayout>
  )
}

const Page = () => (
  <div>
    <h1> This is dashboard</h1>
    <MyResponsiveGrid />
  </div>
);
export const DashboardPage = withProtected(Page);
