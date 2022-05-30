import React, { useRef, useState } from 'react'
import classes from './SearchBar.module.css'

const SearchBar = (props) => {

    const inputRef = useRef()

    const [searchValue, setSearchValue] = useState('')
    const [searchActive, setSearchActive] = useState(false)

    const searchChangeHandler = (event) => {
        setSearchValue(event.target.value)
        props.filterList(event.target.value)
    }

    const searchClickHandler = () => {
        inputRef.current.focus()
    }

    return (
        <div className={classes['search-bar-box']}>
            <div className={classes['search-bar']} >
                <button onClick={searchClickHandler} className={`material-icons ${classes['search-icon']} ${searchActive && classes['search-active']}`}> search</button>
                <input type="text" name="search" ref={inputRef} value={searchValue} onFocus={() => { setSearchActive(true) }} onBlur={() => { setSearchActive(false) }} onChange={searchChangeHandler} placeholder="Search" className={classes['search-input']} autoComplete="off" />
            </div>
        </div>
    )
}

export default SearchBar