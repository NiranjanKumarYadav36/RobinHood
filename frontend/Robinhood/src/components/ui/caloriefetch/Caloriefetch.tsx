import { useState } from "react";
import axios from "axios";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

export default function NutritionQuery() {
  const [query, setQuery] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNutrition = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get("https://api.api-ninjas.com/v1/nutrition", {
        params: { query },
        headers: { "X-Api-Key": " 7nOCvVhqjvl3AEaK4hzpFw==g3NzLdsXv1Gy2hgG" },
      });
      console.log("API Response:", response.data); // Debugging
      setNutritionData(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Nutrition Facts Finder</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter product name (e.g., apple, banana)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={fetchNutrition} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
      {nutritionData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food</TableHead>
              <TableHead>Calories</TableHead>
              <TableHead>Protein (g)</TableHead>
              <TableHead>Carbs (g)</TableHead>
              <TableHead>Fats (g)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nutritionData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.calories}</TableCell>
                <TableCell>{item.protein_g}</TableCell>
                <TableCell>{item.carbohydrates_total_g}</TableCell>
                <TableCell>{item.fat_total_g}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
