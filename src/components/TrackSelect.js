import React from "react";
import styled from "styled-components";

const TrackSelect = ({ track, onClick, value }) => {
  return (
    <Row
      selected={track.selected}
      onClick={onClick ? () => onClick(value) : null}
      id={track.id}
    >
      <AlbumnImg>
        <img src={track.album.images[2].url} alt={track.album.name} />
      </AlbumnImg>
      <SongInfo>
        <SongTitle selected={track.selected}>{track.name}</SongTitle>
        <ArtistTitle>
          {track.artists.map(
            (artist, index) => (index ? ", " : "") + artist.name
          )}
        </ArtistTitle>
        <AlbumTitle>{track.album.name}</AlbumTitle>
      </SongInfo>
    </Row>
  );
};

export default TrackSelect;

const Row = styled.div`
  display: inline-flex;
  flex-direction: row;
  background-color: ${(props) => (props.selected ? "#414f5f" : "#c8e1e3")};
  align-items: center;
  color: ${(props) => (props.selected ? "#c8e1e3" : "#414f5f")};

  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);

  transition: background-color 0.3s ease, color 0.3s ease;
`;

const AlbumnImg = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;

  padding: 15px;

  > * {
    padding: 2.5px;
  }
`;

const SongTitle = styled.div`
  font-weight: 500;
  font-size: 18px;
`;

const ArtistTitle = styled.div`
  font-size: 15px;
`;
const AlbumTitle = styled.div`
  font-size: 15px;
`;
