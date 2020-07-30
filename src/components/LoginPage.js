import React from "react";
import styled from "styled-components";

const LoginPage = () => {
  const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT;
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-library-read",
  ];

  return (
    <Container>
      <Content>
        <Header>TRACK RECOMMENDER.</Header>
        <LoginButton
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`;
          }}
        >
          Connect to Spotify
        </LoginButton>
      </Content>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  min-height: 100vh;
  background-color: #43464b;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  background: linear-gradient(to bottom right, #fff 0%, #fff 64%, #596886 64%);
`;

const Header = styled.h3`
  color: #596886;
  font-size: 50px;
  font-family: "Sansita", sans-serif;
  font-style: italic;
  font-weight: bold;
  text-shadow: #ffd5af 3px 3px;
`;

const LoginButton = styled.button`
  background-color: #414f5f;
  border: 0px;
  font-family: "Sansita", sans-serif;
  font-style: normal;
  font-weight: bold;
  color: #ffd5af;
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
`;

const Content = styled.div`
  margin-left: 30px;
`;
