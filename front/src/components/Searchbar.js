import React, { useState, useEffect } from "react";
import { useSpring, animated as Animated } from 'react-spring'
import { withRouter } from "react-router-dom";

import { SearchIcon, SearchCloseIcon } from "./Icons";
import { searchUser } from "../api/auth.api"

export const Searchbar = withRouter(({ history }) => {
  const [search, setSearch] = useState({
    result: [],
    open: false
  });
  const [query, setQuery] = useState("");
  const props = useSpring({ opacity: search.open ? 1 : 1, from: { opacity: 0 }, duration: 2000 })
  useEffect(() => {
    if (query.length == 3) {
      searchUser({ query }).then((res) => setSearch({ ...search, result: res.data.result }))
    } else {
      setSearch({ ...search, result: search.result.filter(e => e.includes(search.query)) })
    }
  }, [query])

  return (
    <div className="search-bar">
      <form onSubmit={(e) => {
        e.preventDefault();
        history.push(`/${query}/dashboard`)
      }}>
        {search.open && <Animated.input list="results" name="search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />}
        <datalist id="results">
          {search.result.length != 0 ? search.result.map((e, i) => <option value={e} key={i}>{e}</option>) : <option value="no">Sorry we could not find anyone</option>}

        </datalist>
      </form>
      <Animated.button style={props} onClick={() => setSearch({ ...search, open: !search.open })}> {search.open ? <SearchCloseIcon /> : <SearchIcon />}</Animated.button>
    </div>)
})