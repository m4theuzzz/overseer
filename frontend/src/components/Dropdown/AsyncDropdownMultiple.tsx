// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useRef, useState } from 'react'
// import * as S from './styles'

// import { Search } from 'styled-icons/bootstrap'
// import { UpArrow } from 'styled-icons/boxicons-solid'
// import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow'

// import Loader from 'components/Loader'
// import Checkbox from 'components/Checkbox'
// import Popup from 'components/Popup'
// import Input from 'components/Input'
// import { HandleClickOutside } from 'utils/handles/handlers'

// export type DropdownProps = {
//   onDropdownChange: (data: DataType[]) => void
//   initialValue?: DataType[]
//   label?: string
//   placeholder?: string
//   max?: number
// }

// export type DataType = {
//   id: number
//   name: string
//   login?: string
// }

// const AsyncDropdownMultiple = ({
//   onDropdownChange,
//   initialValue,
//   label,
//   placeholder = '...',
//   max
// }: DropdownProps) => {
//   const sentinelRef = useRef(null)

//   const [isActive, setIsActive] = useState(false)
//   const [selectedMultiple, setSelectedMultiple] = useState(initialValue)
//   const [searchTerm, setSearchTerm] = useState(null)
//   const [searchResults, setSearchResults] = useState([])
//   const [data, setData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const fetchData = () => {
//     const perPage = 10
//     const ENDPOINT = 'https://api.github.com/'
//     const URL = searchTerm
//       ? `${ENDPOINT}search/users?q=${searchTerm}`
//       : `${ENDPOINT}users?since=2010&per_page=${perPage}&page=${currentPage}&order=DESC`

//     fetch(URL)
//       .then((response) => response.json())
//       .then((newData) => {
//         const res = newData.items ? newData.items : newData
//         if (!res.length) setError('Sem resultados =(')
//         if (searchTerm) {
//           setSearchResults(res)
//           setLoading(false)
//         } else {
//           setData((prevData) => [...prevData, ...res])
//         }
//       })
//       .catch(() => setError('Um erro ocorreu!'))
//   }

//   useEffect(() => {
//     if (isActive && searchTerm != '') {
//       const timeOutId = setTimeout(fetchData, 500)
//       return () => clearTimeout(timeOutId)
//     }
//   }, [currentPage, searchTerm])

//   useEffect(() => {
//     const { current } = sentinelRef

//     const intersectionObserver = new IntersectionObserver((entries) => {
//       if (entries.some((entry) => entry.isIntersecting)) {
//         setCurrentPage((currentValue) => currentValue + 1)
//         setSearchTerm(null)
//       }
//     })

//     current && intersectionObserver.observe(current)
//     return () => intersectionObserver.disconnect()
//   }, [isActive, searchTerm])

//   useEffect(() => {
//     !!onDropdownChange && onDropdownChange(selectedMultiple)
//   }, [selectedMultiple])

//   const handleMultipleChange = (element: DataType) => {
//     if (!findSelected(selectedMultiple, element.id)) {
//       if (max) {
//         if (selectedMultiple.length == max) {
//           return
//         }
//       }
//       setSelectedMultiple((prevSelected) => [...prevSelected, element])
//     } else {
//       setSelectedMultiple(selectedMultiple.filter((el) => el.id !== element.id))
//     }
//   }

//   const handleChangeSearch = async (a: string) => {
//     setLoading(true)
//     setSearchTerm(a)
//     setError('')

//     if (a == '') {
//       setSearchResults([])
//       setLoading(false)
//     }
//   }

//   const handleClose = () => {
//     setIsActive(false)
//     setSearchResults([])
//     setSearchTerm('')
//     setError('')
//     setLoading(false)
//   }

//   const handleToggle = () => {
//     if (isActive) {
//       handleClose()
//     } else {
//       setIsActive(true)
//     }
//   }

//   const handleBudget = (
//     e: React.MouseEvent<HTMLElement>,
//     element: DataType
//   ) => {
//     e.stopPropagation()
//     setSelectedMultiple(selectedMultiple.filter((el) => el.id !== element.id))
//   }

//   const findSelected = (arr: DataType[], key: number) => {
//     const res = arr.find((el) => el.id == key)
//     return res ? true : false
//   }

//   const renderResults = (arr: DataType[]) => {
//     return arr.map((el) => (
//       <S.DropdownItem key={el.id}>
//         <Checkbox
//           id={el.id}
//           disabled={selectedMultiple.length == max}
//           checked={findSelected(selectedMultiple, el.id)}
//           onCheckboxChange={handleMultipleChange}
//           label={el.name || el.login}
//         />
//       </S.DropdownItem>
//     ))
//   }

//   return <S.AllWrapper>a</S.AllWrapper>
// }

// export default AsyncDropdownMultiple
