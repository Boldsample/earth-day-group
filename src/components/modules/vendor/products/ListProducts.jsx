import { useEffect, useState } from "react"

import { getProducts } from "@services/productServices"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"

const ListProducts = ({id}) => {
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const [products, setProducts] = useState({total: 0, data: []})

  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const callProducts = async () =>{
    let _filter = {}
    _filter['user'] = `p.user=${id}`
    if(filters?.keyword != '')
      _filter['keyword'] = `(p.title LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`
    const _products = await getProducts(_filter, page)
    setProducts(_products)
  }

  useEffect(() => {
    callProducts()
  }, [page])

  return products?.data?.length > 0 && 
    <div className="products">
      {products?.data?.map(product => 
        <MultiUseCard key={product.id} type="product" data={product} />
      )}
    </div>
}

export default ListProducts