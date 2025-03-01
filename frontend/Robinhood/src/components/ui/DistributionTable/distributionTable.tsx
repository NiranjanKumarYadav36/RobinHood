
import React, { useState } from "react"
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

// Sample data with direct image URLs (replace with your own valid URLs)
const data: Distribution[] = [
  {
    id: "1",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=400&q=80",
    ],
    foodName: "Pizza",
    foodDescription: "Delicious cheese pizza with extra toppings",
    expiryDate: "2025-12-31",
  },
  {
    id: "2",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
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
    cell: ({ row, table }) => {
      const distribution = row.original
      const setSelectedImage = table.options.meta?.setSelectedImage // Access function from meta
      return (
        <div className="flex gap-1">
          {distribution.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Food image ${index + 1}`}
              className="w-10 h-10 object-cover rounded cursor-pointer"
              onClick={() => setSelectedImage?.(img)} // Set image on click
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

// **Modal Component**
const ImageModal = ({ imageUrl, onClose }: { imageUrl: string | null, onClose: () => void }) => {
  if (!imageUrl) return null // Don't render if no image is selected

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white p-4 rounded-lg">
        <button className="absolute top-2 right-2 text-gray-500 text-lg" onClick={onClose}>
          ✖
        </button>
        <img src={imageUrl} alt="Expanded View" className="max-w-full max-h-[80vh] rounded" />
      </div>
    </div>
  )
}

// **Main Table Component**
export default function DistributionTable() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { setSelectedImage }, // Pass function to access inside table cells
  })

  return (
    <section className="max-w-7xl p-6 mx-auto bg-green-100 rounded-md shadow-md dark:bg-gray-800 mt-15">
      {/* Modal for Image Popup */}
      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />

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
    </section>
  )
}
