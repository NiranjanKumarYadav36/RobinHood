import React, { useEffect, useState } from "react"
import axios from "axios"
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
  _id: string
  foodName: string
  images: string[] // Array of image URLs
  description: string
  expiryDate: string
  pickupLocation: { latitude: number; longitude: number }
}

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
              src={`http://localhost:5000/${img}`} // Prepend base URL
              alt={`Food image ${index + 1}`}
              className="w-10 h-10 object-cover rounded cursor-pointer"
              onClick={() => setSelectedImage?.(`http://localhost:5000/${img}`)} // Set full image URL
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
    accessorKey: "description",
    header: "Food Description",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => new Date(row.original.expiryDate).toLocaleDateString(), // Format date
  },
  {
    accessorKey: "pickupLocation",
    header: "Pickup Location",
    cell: ({ row }) => {
      const { latitude, longitude } = row.original.pickupLocation
      return `Lat: ${latitude}, Lng: ${longitude}`
    },
  },
]

// **Modal Component**
const ImageModal = ({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) => {
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
  const [data, setData] = useState<Distribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/robinhood/get_food_deatils", {
          userId: "67c3072db62388e3d074d812",
          city: "Mumbai",
        })
        setData(response.data.foods)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch food requests")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
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
        )}
      </div>
    </section>
  )
}