import React, { useState } from "react";
import { SearchIcon, SearchCloseIcon } from "./Icons";


export const Searchbar = () => {
  const [search, setSearch] = useState("")
  return (<>
    <input name="search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
  </>)
}