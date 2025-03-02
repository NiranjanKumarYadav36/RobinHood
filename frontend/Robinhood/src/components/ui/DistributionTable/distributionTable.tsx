import React, { useEffect, useState } from "react"
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
import axios from "axios"
import { useAuth } from "../../../context/AuthContext"

// Define the data type for a food distribution item.
export type Distribution = {
  id: string
  images: string[] // Array of image URLs
  foodName: string
  foodDescription: string
  expiryDate: string
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
              src={`http://localhost:5000/${img}`} // Add full backend URL
              alt={`Food image ${index + 1}`}
              className="w-10 h-10 object-cover rounded cursor-pointer"
              onClick={() => setSelectedImage?.(`http://localhost:5000/${img}`)}
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
  const [data, setData] = useState<Distribution[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth();

  useEffect(() => {
    const fetchFoodData = async () => {
      if (!user) return; // Ensure user is available before making the request

      try {
        const response = await axios.get("http://localhost:5000/robinhood/get_food_details", {
          params: { userId: user.id, city: user.city },
        });

        const foodData = response.data.data.map((item: any) => ({
          id: item._id,
          images: item.images,
          foodName: item.foodName,
          foodDescription: item.description,
          expiryDate: new Date(item.expiryDate).toLocaleDateString(),
        }));

        setData(foodData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load food requests.");
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [user]); // Re-fetch when user data changes


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
          <p className="text-center text-lg">Loading food requests...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <TableHeader className="bg-green-500 text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-left">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-3 font-semibold">
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
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`text-gray-800 transition duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-green-100`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 border border-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-600">
                    No results found.
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