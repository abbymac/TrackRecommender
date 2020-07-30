import React, { useEffect, useState, useReducer } from "react";
import styled from "styled-components";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import LoginPage from "./LoginPage";
import filterOptions from "./FilterOptions";
import hash from "../hash";
import FilterNum from "./FilterNum";
import TrackSelect from "./TrackSelect";

const MainPage = () => {
  const [token, setToken] = useState("");

  const [noData, setNoData] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [songData, setSongData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  //set filters for which target params you want.
  // const [filters, setFilters] = useState([]);
  const [state, dispatch] = useReducer(reducer, filterOptions);
  const [songRecs, setSongRecs] = useState([]);

  useEffect(() => {
    const tick = () => {
      if (!token) {
        getInfo(token);
      }
    };
    let token = hash.access_token;
    if (token) {
      // Set token
      setToken(token);
      getInfo(token);
    }
    const interval = setInterval(() => tick(), 5000);
    return () => clearInterval(interval);
  }, []);

  const getInfo = (token) => {
    // Make a call using the token
    axios
      .get("https://api.spotify.com/v1/me/tracks", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (!res.data) {
          setNoData(true);
          return;
        }
        res.data.items.map((track) => (track.track.selected = false));

        setTracks(res.data.items);
        var ids = [];
        res.data.items.map((track) => ids.push(track.track.id));
        axios
          .get(
            `https://api.spotify.com/v1/audio-features/?ids=${ids.join(",")}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          )
          .then((res) => {
            setSongData(res.data.audio_features);
          })
          .catch((err) => {
            console.log(err);
          });

        setLoading(false);
      })
      .then(() => {
        setNoData(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //specific filters.. add feature in future.
  // const handleFilterChange = (e) => {
  //   console.log("e is", e);
  //   // setFilters(e);
  //   setFilters((filts) => [...filts, e]);
  // };

  //specific filters.. add feature in future.
  // useEffect(() => {
  //   console.log("filter has changed.");
  // }, [filters]);

  const getNewTracks = () => {
    const endPoint = "https://api.spotify.com/v1/recommendations?";
    var targetVal = "";

    Object.keys(filterOptions).map((filterName, i) => {
      var targetName = "target_" + filterName;
      i === 0
        ? (targetVal = targetName + "=" + state[filterName].value)
        : (targetVal += "&" + targetName + "=" + state[filterName].value);

      return targetVal;
    });
    var seedTracks = [];
    tracks.map((track) => {
      if (track.track.selected) return seedTracks.push(track.track.id);
    });
    if (seedTracks.length === 0) {
      alert("please selected at least one seed track to get recommendations.");
    } else {
      axios
        .get(`${endPoint}seed_tracks=${seedTracks}&${targetVal}&market=US`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (!res.data) {
            setNoData(true);
            return;
          }
          setSongRecs(res.data.tracks);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSelect = (selectedTrackName) => {
    setTracks(
      [...tracks].map((track) => {
        if (track.track.name === selectedTrackName) {
          var toggleSelect = !track.track.selected;
          return {
            ...track,
            track: {
              ...track.track,
              selected: toggleSelect,
            },
          };
        } else return track;
      })
    );
  };
  return (
    <>
      {!token && isLoading && <LoginPage />}
      {token &&
        !noData &&
        !isLoading &&
        songData.length > 0 &&
        state !== undefined && (
          <BigContainer>
            {/* <h2>Filters</h2>

            <h4>Add Filter</h4> */}

            {/* <FormControl>
              <InputLabel id="demo-mutiple-name-label">Filters</InputLabel>
              <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                multiple
                value={filters}
                onChange={(e) => handleFilterChange(e.target.value)}
                input={<Input />}
              >
                {Object.keys(filterOptions).map((filtName, i) => {
                  return (
                    <MenuItem key={i} value={filtName}>
                      {filtName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl> */}

            <About>
              Follow the steps to find new songs based on the tracks you like.
              Define audio features for more personalized results.{" "}
            </About>
            <StepHeader>
              1. Select Seed Tracks From Your Latest Liked Songs.
            </StepHeader>
            <SeedTrackContainer>
              {tracks.map((track, i) => {
                return (
                  <TrackSelect
                    track={track.track}
                    value={track.track.name}
                    onClick={handleSelect}
                    key={i}
                  />
                );
              })}
            </SeedTrackContainer>
            <StepHeader>2. Select Target Parameters</StepHeader>
            <ParamterContainer>
              <ParameterGrid container spacing={3}>
                {Object.keys(state).map((filtName, i) => (
                  <FilterNum
                    name={filtName}
                    filter={state[filtName]}
                    dispatch={dispatch}
                    key={i}
                  />
                ))}
              </ParameterGrid>
            </ParamterContainer>

            <StepHeader>3. Get Tracks</StepHeader>
            <GetNewButton onClick={() => getNewTracks()}>
              Find New Tracks
            </GetNewButton>
            {songRecs.length > 0 && (
              <>
                <StepHeader>Browse New Tracks!</StepHeader>
                <RecommendContainer>
                  {songRecs.map((track, i) => {
                    return (
                      <TrackSelect
                        keyVal={i}
                        track={track}
                        value={track.name}
                      />
                    );
                  })}
                </RecommendContainer>
              </>
            )}
          </BigContainer>
        )}
      {noData && <p>Make sure spotify is authenticated.</p>}
    </>
  );
};

const reducer = (state, action) => {
  var interval = 0.1;
  var precision = 2;
  if (action.payload === "tempo" || action.payload === "loudness") {
    interval = 1;
    if (action.payload === "tempo") {
      precision = 3;
    }
  } else if (action.payload === "instrumentalness") {
    interval = 0.01;
    precision = 3;
  }

  // debugger;

  switch (action.type) {
    case "addValue":
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          value: parseFloat(
            (state[action.payload].value + interval).toPrecision(precision)
          ),
        },
      };
    case "reduceValue":
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          value: parseFloat(
            (state[action.payload].value - interval).toPrecision(precision)
          ),
        },
      };
    default:
      return null;
  }
};

export default MainPage;

const SeedTrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 80%;
  min-width: 65%;
  margin: auto;
  // padding: 15px;
  // background-color: #bbbec3;
`;

const StepHeader = styled.div`
  font-size: 20px;
  font-family: "Staatliches";
  margin: 20px;
  display: flex;
  align-self: center;
`;

const BigContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  background-color: #f5f5f5;
`;

const About = styled.div`
  font-size: 14px;
  display: flex;
  align-self: center;
  margin: 20px;
`;

const ParameterGrid = styled(Grid)`
  background-color: #bbbec3;
`;

const ParamterContainer = styled.div`
  width: 70%;
  margin: auto;
  padding: 15px;
`;

const GetNewButton = styled.button`
  background-color: #414f5f;
  border: 0px;
  color: #c8e1e3;
  border-radius: 9px;
  font-size: 19px;
  display: inline;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 13px 25px;
  transition: background-color 0.5s ease;
  outline-style: none;
  &:hover {
    background-color: #1f262e;
    cursor: pointer;
  }
  margin: 0 auto 40px auto;
`;

const RecommendContainer = styled(SeedTrackContainer)``;
