import Artist from "./Artist";

export default function ArtistList({ artists }) {
  return (
    <>
      <h2>Artists</h2>
      {artists.map((artist, i) => {
        return <Artist key={i} artist={artist} />;
      })}
    </>
  );
}
