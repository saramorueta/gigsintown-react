import React, { Component } from 'react';

import moment from 'moment';

class SpotifyPlayer extends Component {
    render() {
        const iframeUrl = "https://open.spotify.com/embed?uri=spotify:artist:" + encodeURIComponent(this.props.artistId) + "&theme=white"
        const iframeTitle = "Spotify player for " + this.props.artistName
        return (
        <div className="player">
            <iframe src={iframeUrl} 
            width="300"
            height="80"
            frameBorder="0"
            allowtransparency="true"
            title={iframeTitle} />
        </div>
        )
    }
}

class Gig extends Component {
    constructor(props) {
      super(props)
      this.state = {
        displayPlayers: false
      }
    }
  
    renderVenue() {
      const googleMapsUrl = function(venue) {
        return "https://www.google.com/maps/place/" + encodeURIComponent(venue.name) +
          "/@" + venue.coordinates.lat + "," + venue.coordinates.lng
      }
  
      const venueAddress = this.props.venue.address && this.props.venue.coordinates
        ? <a href={googleMapsUrl(this.props.venue)} target="blank"><i className="fa fa-map-marker"/> {this.props.venue.address}</a>
        : null
  
      return (
        <h4>{this.props.venue.name}</h4>
      )
    }
  
    renderDate() {
      const date = moment.utc(this.props.date, "YYYY-MM-DD")
      const diff = date.diff(moment.utc().startOf("day"))

      const oneDay = 86400000
      const oneWeek = oneDay * 7
  
      if (diff === -oneDay) {
        return "Yesterday"
      }
      else if (diff === 0) {
        return "Today"
      }
      else if (diff === oneDay) {
        return "Tomorrow"
      }
      else if (diff > oneDay && diff < oneWeek) {
        return date.format("dddd")
      }
      else {
        return date.format("DD/MM/YYYY")
      }
    }
  
    render() {
      const artists = this.props.artists
        .map(function(artist) { return artist.name })
        .join(", ")
  
      const tags = this.props.tags
        .map(function(tag) { return ([
          <span className="badge badge-secondary" key={tag}>{tag}</span>, " "
        ])})
  
      function googleMapsUrl(venue) {
          return "https://www.google.com/maps/place/" + encodeURIComponent(venue.name) +
              "/@" + venue.coordinates.lat + "," + venue.coordinates.lng
        }
    
      const showOnMap = this.props.venue.coordinates
        ? <a target="blank" href={googleMapsUrl(this.props.venue)} className="btn btn-info" title={this.props.venue.address}>Show on map <i className="fa fa-map-marker"/></a>
        : null
  
      const spotifyIntegration = this.props.artists
        .find(function(artist) { return artist.spotifyId })
      
      const listenOnSpotify = spotifyIntegration && !this.state.displaySpotifyPlayers
        ? <span className="btn btn-success" onClick={() => this.setState({displaySpotifyPlayers: true})}><i className="fa fa-spotify"/> Listen on Spotify</span>
        : null
  
      const spotifyPlayers = this.state.displaySpotifyPlayers
        ? this.props.artists
          .filter(function(artist) { return artist.spotifyId })
          .map(function(artist) {
            return (<SpotifyPlayer key={artist.spotifyId} artistId={artist.spotifyId} artistName={artist.name} />)
          })
        : null
  
      // const images = this.props.artists
      //   .filter(function(artist) { return artist.imageUrl; })
      //   .map(function(artist) { return (
      //     <img src={artist.imageUrl} alt={artist.name} className="img-circle"/>
      //   )})
  
      return (
        <article className="gig">
          <span className="badge badge-danger when">{this.renderDate()}</span>
          <h3>
            <div className="artists-names">{artists}</div>
          </h3>
          <div className="tags">{tags}</div>
          <address>
            <h4>{this.props.venue.name}</h4>
            {this.props.venue.address}
          </address>
          <div className="players">{listenOnSpotify}{spotifyPlayers}</div>
          <div className="controls">
            {showOnMap}
            {" "}
            <a target="blank" href={this.props.uri} className="btn btn-secondary">Find out more <i className="fa fa-external-link"/></a>
          </div>
        </article>
      )
    }
  }


export default Gig;
