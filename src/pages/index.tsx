import { FormEvent, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [targetUrl, setTargetUrl] = useState("");
  const [linkToFind, setLinkToFind] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/search", {
        targetUrl,
        linkToFind,
      });
      setSearchResult(response.data.message);
    } catch (error: any) {
      setSearchResult("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <Input
          type="text"
          placeholder="Enter target website URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <Input
          type="text"
          placeholder="Enter specific link URL to find"
          value={linkToFind}
          onChange={(e) => setLinkToFind(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <Button
          type="submit"
          className="w-full px-3 py-2 text-white rounded-md"
        >
          Search
        </Button>
      </form>
      {searchResult && <p className="mt-4 text-center">{searchResult}</p>}
    </div>
  );
}
