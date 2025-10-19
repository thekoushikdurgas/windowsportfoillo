'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function StartMenuSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="mb-4">
      <motion.div
        className={`
          relative flex items-center bg-white bg-opacity-10 rounded-lg px-3 py-2
          ${isFocused ? 'ring-2 ring-windows-blue ring-opacity-50' : ''}
        `}
        animate={{
          backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search apps, files, and settings"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </motion.div>
    </div>
  )
}
