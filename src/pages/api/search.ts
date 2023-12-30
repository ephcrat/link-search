import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { targetUrl, linkToFind } = req.body;

    try {
      const response = await axios.get(targetUrl);
      const html = response.data;
      const $ = cheerio.load(html);
      const links = $("a")
        .map((i, el) => $(el).attr("href"))
        .get();

      const found = links.some((link) => link === linkToFind);
      res
        .status(200)
        .json({ message: found ? "Link found!" : "Link not found." });
    } catch (error: any) {
      res.status(500).json({ message: "Error: " + error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
