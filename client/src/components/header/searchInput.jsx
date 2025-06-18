import React from 'react'
import { Menu, Search, Mic, Plus, Bell, User, Home, Scissors, Play, Clock, List, PlaySquare, GraduationCap, ThumbsUp, ChevronRight, ChevronDown, TrendingUp, Sun, Moon } from 'lucide-react';


function searchInput({
    theme,

}) {
  return (
    <>
        <div className="flex items-center flex-1">
            <div className={`flex items-center flex-1 ${theme.searchBg} border ${theme.searchBorder} rounded-l-full`}>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`bg-transparent flex-1 px-4 py-2 ${theme.text} ${theme.placeholder} focus:outline-none`}
                />
            </div>
            <button className={`${theme.searchButton} border ${theme.searchBorder} border-l-0 rounded-r-full px-6 py-2 transition-colors`}>
              <Search size={20} />
            </button>
          </div>
    </>
  )
}

export default searchInput
