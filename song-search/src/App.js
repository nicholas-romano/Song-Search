import { useState } from "react";
import artists from "./stored-data/artists.json";
import songs from "./stored-data/songs.json";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Search from "./Search";
import ArtistList from "./ArtistList";
import SongList from "./SongList";
import "./App.css";

export default function App() {
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const saveSessionData = (category, data) => {
    sessionStorage.setItem(category, JSON.stringify(data));
  };

  const getSessionData = (name) => {
    return sessionStorage.getItem(name);
  };

  const FetchApiData = (url) => {
    /* API End points */
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "8963a1dcd3msh9f2100cef320782p15698cjsn62e48520fcd7",
        "x-rapidapi-host": "shazam.p.rapidapi.com",
      },
    };
    /* End API End points */

    try {
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            const artistsCollection = data.artists.hits;
            const songsCollection = data.tracks.hits;
            saveSessionData("artists", artistsCollection);
            saveSessionData("songs", songsCollection);
            saveSessionData("searchQuery", searchQuery);
            setArtistSearchResults(artistsCollection);
            setSongSearchResults(songsCollection);
          }
        })
        .catch((err) => {
          console.error(err);
          const sessionStorageData = checkForSessionStorageData();
          if (sessionStorageData) {
            SessionStorageData();
          } else {
            SampleData();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const checkForSessionStorageData = () => {
    let searchQuery = getSessionData("searchQuery");
    let artistsData = getSessionData("artists");
    let songsData = getSessionData("songs");

    if (!searchQuery && !artistsData && !songsData) {
      return false;
    } else {
      return true;
    }
  };

  const SampleData = () => {
    saveSessionData("searchQuery", "kiss the rain");
    setSearchQuery("kiss the rain");

    saveSessionData("artists", artists);
    setArtistSearchResults(artists);

    saveSessionData("songs", songs);
    setSongSearchResults(songs);
  };

  const setUrlSearchString = (searchTerm) => {
    let urlSearchTerm = searchTerm.replaceAll(" ", "%20");
    urlSearchTerm = urlSearchTerm.replaceAll('"', "");
    return `https://shazam.p.rapidapi.com/search?term=${urlSearchTerm}&locale=en-US&offset=0&limit=10`;
  };

  const SessionStorageData = () => {
    let artistsData = getSessionData("artists");
    let songsData = getSessionData("songs");

    if (artistsData !== JSON.stringify(artistSearchResults)) {
      setArtistSearchResults(JSON.parse(artistsData));
    }

    if (songsData !== JSON.stringify(songSearchResults)) {
      setSongSearchResults(JSON.parse(songsData));
    }
  };

  const handleSearchQuery = (e) => {
    e.preventDefault();

    console.log("searchQuery state ", searchQuery);

    if (!searchQuery) return;

    let searchTerm = searchQuery.toLowerCase();

    searchTerm = `"${searchTerm}"`;

    console.log("searchTerm: ", searchTerm);

    const searchQuerySessionData = getSessionData("searchQuery");

    console.log("searchQuerySessionData ", searchQuerySessionData);

    // Check to see if Search Query matches Session Storage
    if (searchTerm === searchQuerySessionData) {
      //If they are equal, use session storage data:
      console.log("use session storage data");
      SessionStorageData();
    } else {
      //If they are not equal, set session storage data to new string:
      console.log("fetch API data");
      const url = setUrlSearchString(searchTerm);
      console.log("search url: ", url);
      FetchApiData(url);
    }
  };

  return (
    <div className="wrapper">
      <Container className="container">
        <header>
          <h1 className="title">Song Search</h1>
          <p>
            Powered by{" "}
            <img
              src={`${process.env.PUBLIC_URL}/images/shazam-music-logo-icon.png`}
              alt="Shazam Music"
            />
          </p>
        </header>
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchQuery={handleSearchQuery}
        />
        {artistSearchResults.length > 0 ? (
          <Row>
            <ArtistList artists={artistSearchResults} />
          </Row>
        ) : (
          ""
        )}

        {songSearchResults.length > 0 ? (
          <Row>
            <SongList songs={songSearchResults} />
          </Row>
        ) : (
          ""
        )}
      </Container>
      <div className="footer">
        <p>Developed by Nicholas Romano 2024</p>
      </div>
    </div>
  );
}
