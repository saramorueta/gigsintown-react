import React, { Component } from 'react';
import './App.css';

function fetchJson(url) {
  return fetch(url).then((resp) => resp.json())
}

function gigsApiUrl(location, startDate, query, tags) {
  return "http://localhost:9000/api/gigs?pageSize=20" +
    (location ? "&location=" + encodeURIComponent(location) : "") +
    (startDate ? "&startDate=" + encodeURIComponent(startDate) : "") +
    (query ? "&query=" + encodeURIComponent(query) : "") +
    (tags ? "&tags=" + encodeURIComponent(tags) : "")
}


class SpotifyPlayer extends Component {
  constructor(props) {
    super(props)
    this.iframeUrl = "https://open.spotify.com/embed?uri=spotify:artist:" + encodeURIComponent(props.artistId) + "&theme=white"
  }

  render() {
    return (
      <div className="player">
        <iframe src={this.iframeUrl} width="300" height="80" frameborder="0" allowtransparency="true" />
      </div>
    )
  }
}


class Place extends Component {
  render() {
    var url = "https://www.google.com/maps/place/" + encodeURIComponent(this.props.name) +
      "/@" + this.props.lat + "," + this.props.lng
    
    return (
      <a href={url} target="blank">{this.props.address}</a>
    )
  }
}


class Gig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayPlayers: false
    }
    this.displayPlayers = this.displayPlayers.bind(this)
  }

  displayPlayers = function() {
    this.setState({
      displayPlayers: true
    })
  }

  render() {
    var gig = this.props.gig

    var artists = this.props.artists
      .map(function(artist) { return artist.name })
      .join(", ")

    var tags = this.props.tags
      .map(function(tag) { return ([
        <span className="label label-primary">{tag}</span>, " "
      ])})

    var images = this.props.artists
      .filter(function(artist) { return artist.imageUrl; })
      .map(function(artist) { return (
        <img src={artist.imageUrl} alt={artist.name} className="img-circle"/>
      )})

    var spotifyPlayers = this.props.artists
      .filter(function(artist) { return artist.spotifyId; })
      .map(function(artist) {
        return (
          <SpotifyPlayer artistId={artist.spotifyId} />
        )
      })
    
    var spotifyPlayersLink = (spotifyPlayers.length > 0)
        ? <span className="btn btn-success" onClick={this.displayPlayers}>Listen on Spotify</span>
        : null

    var venueAddress = this.props.venue.coordinates
      ? <Place 
        name={this.props.venue.name} 
        lat={this.props.venue.coordinates.lat}
        lng={this.props.venue.coordinates.lng}
        address={this.props.venue.address} />
      : null

    return (
      <div className="gig">
        <h3>
          <div className="artists-names">{artists}</div>
        </h3>
        <div className="tags">{tags}</div>
        <address className="venue">
          <h4>{this.props.venue.name}</h4>
          {venueAddress}
        </address>
        <div className="players">{this.state.displayPlayers ? spotifyPlayers : spotifyPlayersLink}</div>
        <div className="external-link"><a target="blank" href={this.props.uri}>Find out more</a></div>
      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiResponse: {"gigs": []}
    }
    fetchJson(gigsApiUrl("london", "2017-12-26"))
      .then((apiResponse) => this.setState({
        "apiResponse": apiResponse
      }))
  }

  render() {
    var gigs = this.state.apiResponse.gigs.map(function(gig) {
      return ( <Gig 
        artists={gig.artists} 
        venue={gig.venue}
        uri={gig.uri}
        tags={gig.tags} /> )
    })

    return (
      <div id="gigs">{gigs}</div>
    )
  }
}

export default App;
