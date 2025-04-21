const mediaLibrary = {
    movies: [
      {
        title: "The Matrix",
        year: 1999,
        genre: "Sci-Fi",
        actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        director: "The Wachowskis",
        runtime: "136 minutes"
      },
      {
        title: "Inception",
        year: 2010,
        genre: "Action",
        actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        director: "Christopher Nolan",
        runtime: "148 minutes"
      }
    ],
    series: [
      {
        title: "Stranger Things",
        seasons: [
          { season: 1, episodes: 8, year: 2016 },
          { season: 2, episodes: 9, year: 2017 }
        ],
        cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"],
        creator: "The Duffer Brothers"
      },
      {
        title: "Breaking Bad",
        seasons: [
          { season: 1, episodes: 7, year: 2008 },
          { season: 2, episodes: 13, year: 2009 }
        ],
        cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
        creator: "Vince Gilligan"
      }
    ],
    songs: [
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:20",
        featuredArtists: []
      },
      {
        title: "Stay",
        artist: "The Kid LAROI",
        duration: "2:21",
        featuredArtists: ["Justin Bieber"]
      }
    ]
  };
  
  module.exports = mediaLibrary;
  