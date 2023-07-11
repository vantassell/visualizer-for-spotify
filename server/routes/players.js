const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// /players
router.get("/:accessToken", async (req, res) => {
  // const user = await prisma.user.findMany({
  //   where: { email: "vantassell@gmail.com" },
  //   // where: {email: session.user.email},
  // });
  //
  // const [account] = await prisma.account.findMany({
  //   where: { userId: user.id },
  // });

  const spotifyRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${req.params.accessToken}`,
      },
    }
  );

  // Recommendation: handle errors
  if (!spotifyRes) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  // check if no song was playing
  if (spotifyRes.statusCode === 204) {
    res.json({
      title: "No song is currently playing",
      artist: "",
      album: "",
      // artworkURL: "https://i.imgflip.com/35xh5n.jpg",
      artworkURL:
        "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/03/michael-scott-the-office-memes.jpg",
    });
    return;
  }

  const data = await spotifyRes.json();

  // console.log(`Data: ${JSON.stringify(data)}`);
  const title = data.item.name || "";
  const artist =
    data.item.artists.map((artist) => artist.name).join(", ") || "";
  const album = data.item.album.name || "";
  const artworkURL = data.item.album.images[0].url || "";

  // res.render("index", { songTitle, songArtist, songAlbum, songArtworkURL });
  res.json({ title, artist, album, artworkURL });
  console.log({
    accessToken: req.params.accessToken,
    trackInfo: { title, artist, album },
    artworkURL,
  });
  console.log("done");
});

router.get("/new", (req, res) => {
  res.send("user new form");
});

router.post("/", (req, res) => {
  res.sent("create user");
});

// handle all the GET, PUT, DELETE in same call
router
  .route("/:id")
  .get((req, res) => {
    res.send(`get user with ID: ${req.params.id}`);
  })
  .put((req, res) => {
    res.send(`get user with ID: ${req.params.id}`);
  })
  .delete((req, res) => {
    res.send(`get user with ID: ${req.params.id}`);
  });

// middleware for any ID call
router.param("id", (req, res, next, id) => {
  console.log("received id req");
  next();
});

module.exports = router;
