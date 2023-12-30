import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { targets, linkToFind } = req.body;
    let results: { [key: string]: string } = {};

    await Promise.all(
      targets.map(async (targetUrl: string) => {
        try {
          const response = await axios.get(targetUrl);
          const html = response.data;
          const $ = cheerio.load(html);
          const pageLinks = $("a")
            .map((i, el) => $(el).attr("href"))
            .get();

          results[targetUrl] = pageLinks.includes(linkToFind)
            ? "Found"
            : "Not Found";
        } catch (error: any) {
          results[targetUrl] = "Error: " + error.message;
        }
      })
    );

    res.status(200).json({ results });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
