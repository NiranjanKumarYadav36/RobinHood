"use client"

import React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table"

// Define the data type for a food distribution item.
export type Distribution = {
  id: string
  images: string[] // Array of image URLs
  foodName: string
  foodDescription: string
  expiryDate: string
}

// Sample data
const data: Distribution[] = [
  {
    id: "1",
    images: [
      "C:/Users/sanff/Pictures/Saved Pictures/Sanffred_Arc.png",
      "C:/Users/sanff/Pictures/Saved Pictures/pagess.jpg",
    ],
    foodName: "Pizza",
    foodDescription: "Delicious cheese pizza with extra toppings",
    expiryDate: "2025-12-31",
  },
  {
    id: "2",
    images: [
      "C:/Users/sanff/Pictures/Saved Pictures/water art.jpg",
    ],
    foodName: "Burger",
    foodDescription: "Juicy burger with fries",
    expiryDate: "2025-11-30",
  },
]

// Define table columns.
export const columns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const distribution = row.original
      return (
        <div className="flex gap-1">
          {distribution.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Food image ${index + 1}`}
              className="w-10 h-10 object-cover rounded"
              loading="lazy"
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "foodName",
    header: "Food Name",
  },
  {
    accessorKey: "foodDescription",
    header: "Food Description",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
]

// Main component to render the data table.
export default function DistributionTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
