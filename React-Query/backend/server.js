import express from "express";

const app = express();
const PORT = 5000;

app.get("/api/data", (req, res) => {
  const animeData = [
  {
    id: 1,
    name: "Jujutsu Kaisen",
    ratings: 8.6,
    image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
  },
  {
    id: 2,
    name: "Demon Slayer: Kimetsu no Yaiba",
    ratings: 8.5,
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
  },
  {
    id: 3,
    name: "Naruto",
    ratings: 8.3,
    image: "https://cdn.myanimelist.net/images/anime/13/17405.jpg"
  },
  {
    id: 4,
    name: "Wind Breaker",
    ratings: 7.8,
    image: "https://cdn.myanimelist.net/images/anime/1888/140322.jpg"
  },
  {
    id: 5,
    name: "Solo Leveling",
    ratings: 8.4,
    image: "https://cdn.myanimelist.net/images/anime/1926/140154.jpg"
  }
];
// http://localhost:5000/api/data?search=jujutsu
if(req.query.search){
    const filteredData = animeData.filter((anime) => anime.name.toLowerCase().includes(req.query.search.toLowerCase()));
    res.send(filteredData);
    return;
}
setTimeout(() => {
    res.json(animeData);
  }, 3000); // Simulate a 3-second delay

  
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});