import React from 'react'
import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TableSkeleton = () => {
  const items = Array.from({ length: 6 }, (v, i) => i);

  return (
    <DataTable value={items} className="p-datatable-striped">
      <Column field="Title" header="Title" style={{ width: '25%' }} body={<Skeleton />}></Column>
      <Column field="Material" header="Material" style={{ width: '25%' }} body={<Skeleton />}></Column>
      <Column field="Quantity" header="Quantity" style={{ width: '25%' }} body={<Skeleton />}></Column>
      <Column field="Sell Price" header="Sell Price" style={{ width: '25%' }} body={<Skeleton />}></Column>
      <Column field="Offers" header="Offers" style={{ width: '25%' }} body={<Skeleton />}></Column>
      <Column field="Published Date" header="Published Date" style={{ width: '25%' }} body={<Skeleton />}></Column>
    </DataTable>
  )
}

export default TableSkeleton