import { useCallback, useEffect, useState, Suspense } from "react";
import artists from "./stored-data/artists.json";
import songs from "./stored-data/songs.json";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Search from "./Search";
import ArtistList from "./ArtistList";
import SongList from "./SongList";
import "./App.css";
import NoSearchResults from "./NoSearchResults";

export default function App() {
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noSearchResults, setNoSearchResults] = useState(false);

  function savelocalStorageData(category, data) {
    localStorage.setItem(category, JSON.stringify(data));
  }

  function getlocalStorageData(name) {
    return localStorage.getItem(name);
  }

  const FetchApiData = useCallback(
    (url) => {
      /* API End points */
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "8963a1dcd3msh9f2100cef320782p15698cjsn62e48520fcd7",
          "x-rapidapi-host": "shazam.p.rapidapi.com",
        },
      };
      /* End API End points */

      try {
        fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            if (data.artists.hits) {
              const artistsCollection = data.artists.hits;
              const songsCollection = data.tracks.hits;
              savelocalStorageData("artists", artistsCollection);
              savelocalStorageData("songs", songsCollection);
              savelocalStorageData("searchQuery", searchQuery);
              setArtistSearchResults(artistsCollection);
              setSongSearchResults(songsCollection);
            }
          })
          .catch((error) => {
            setNoSearchResults(true);
          });
      } catch (error) {
        console.log(error);
      }
    },
    [searchQuery]
  );

  const checkForlocalStorageData = useCallback(() => {
    let searchQuery = getlocalStorageData("searchQuery");
    let artistsData = getlocalStorageData("artists");
    let songsData = getlocalStorageData("songs");

    if (!searchQuery && !artistsData && !songsData) {
      return false;
    } else {
      return true;
    }
  }, []);

  const SampleData = useCallback(() => {
    savelocalStorageData("searchQuery", "kiss the rain");
    setSearchQuery("kiss the rain");

    savelocalStorageData("artists", artists);
    setArtistSearchResults(artists);

    savelocalStorageData("songs", songs);
    setSongSearchResults(songs);
  }, []);

  function setUrlSearchString(searchTerm) {
    let urlSearchTerm = searchTerm.replaceAll(" ", "%20");
    urlSearchTerm = urlSearchTerm.replaceAll('"', "");
    return `https://shazam.p.rapidapi.com/search?term=${urlSearchTerm}&locale=en-US&offset=0&limit=10`;
  }

  const localStorageData = useCallback(() => {
    let artistsData = getlocalStorageData("artists");
    let songsData = getlocalStorageData("songs");

    if (searchQuery === "") {
      const search = getlocalStorageData("searchQuery");
      const searchStr = search.replaceAll('"', "");
      setSearchQuery(searchStr);
    }

    if (artistsData !== JSON.stringify(artistSearchResults)) {
      setArtistSearchResults(JSON.parse(artistsData));
    }

    if (songsData !== JSON.stringify(songSearchResults)) {
      setSongSearchResults(JSON.parse(songsData));
    }
  }, [searchQuery, artistSearchResults, songSearchResults]);

  function handleSearchQuery(e) {
    e.preventDefault();

    if (!searchQuery) return;

    let searchTerm = searchQuery.toLowerCase();

    searchTerm = `"${searchTerm}"`;

    const searchQuerySessionData = getlocalStorageData("searchQuery");

    // Check to see if Search Query matches Session Storage
    if (searchTerm === searchQuerySessionData) {
      //If they are equal, use session storage data:
      localStorageData();
    } else {
      //If they are not equal, set session storage data to new string:
      const url = setUrlSearchString(searchTerm);
      FetchApiData(url);
    }
  }

  useEffect(() => {
    setNoSearchResults(false);
  }, []);

  useEffect(() => {
    if (checkForlocalStorageData()) {
      localStorageData();
    } else {
      SampleData();
    }
  }, [checkForlocalStorageData, SampleData, localStorageData]);

  return (
    <div className="wrapper">
      <Container className="container">
        <>
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
          {noSearchResults ? (
            <NoSearchResults />
          ) : (
            <>
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
            </>
          )}
        </>
      </Container>
      <div className="footer">
        <p>Developed by Nicholas Romano 2024</p>
      </div>
    </div>
  );
}
