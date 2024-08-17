import Song from "./Song";

export default function SongList({ songs }) {
  return (
    <>
      <h2>Songs</h2>
      {songs.map((song, i) => {
        return <Song key={i} song={song} />;
      })}
    </>
  );
}
