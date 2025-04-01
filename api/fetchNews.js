export default async function handler(req, res) {
  const { page } = req.query;

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=${process.env.NEWS_API_KEY}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Upgrade-Insecure-Requests": "1",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: error.message });
  }
}
