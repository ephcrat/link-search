import { FormEvent, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  const [targetUrls, setTargetUrls] = useState<string>("");
  const [linkToFind, setLinkToFind] = useState("");
  const [searchResults, setSearchResults] = useState<{ [key: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const targets = targetUrls.split(/\s*,\s*|\s+/); // Split by comma or whitespace
    try {
      setLoading(true);
      const response = await axios.post("/api/search", { targets, linkToFind });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex p-4 justify-end items-end ">
        <ModeToggle />
      </div>
      <div className="flex flex-col px-3 items-center justify-center min-h-screen">
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <Textarea
            placeholder="Enter target website URLs (comma or line-separated)"
            value={targetUrls}
            onChange={(e) => setTargetUrls(e.target.value)}
            required
            className="w-full h-36 mb-4 border rounded-md"
          />

          <Input
            type="text"
            placeholder="Enter specific link URL to find"
            value={linkToFind}
            onChange={(e) => setLinkToFind(e.target.value)}
            required
            className="w-full mb-4 border rounded-md"
          />
          <Button
            type="submit"
            className="w-full  rounded-md flex justify-center items-center"
            disabled={loading}
          >
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
        <ResultsTable searchResults={searchResults} />
      </div>
    </>
  );
}

const ResultsTable = ({
  searchResults,
}: {
  searchResults: { [key: string]: string };
}) => {
  return (
    <Table className="mt-4 items-center justify-center">
      <TableCaption>Your Search Results</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Target URL</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(searchResults).map(([url, status]) => (
          <TableRow key={url}>
            <TableCell>{url}</TableCell>
            <TableCell>
              {status === "Found" ? (
                <Badge variant="outline" className="bg-emerald-600">
                  {status}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-600">
                  {status}
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
