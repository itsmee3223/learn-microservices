import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running on port 3000",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
