import React, { Component } from 'react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component'
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
  render() {
    const iframeUrl = "https://open.spotify.com/embed?uri=spotify:artist:" + encodeURIComponent(this.props.artistId) + "&theme=white"
    const iframeTitle = "Spotify player for " + this.props.artistName
    return (
      <div className="player">
        <iframe src={iframeUrl} 
          width="300"
          height="80"
          frameborder="0"
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
    this.displayPlayers = this.displayPlayers.bind(this)
  }

  renderVenue() {
    const googleMapsUrl = function(venue) {
      return "https://www.google.com/maps/place/" + encodeURIComponent(venue.name) +
        "/@" + venue.coordinates.lat + "," + venue.coordinates.lng
    }

    const venueAddress = this.props.venue.address && this.props.venue.coordinates
      ? <a href={googleMapsUrl(this.props.venue)} target="blank">{this.props.venue.address}</a>
      : null

    return (
      <address className="venue">
        <h4>{this.props.venue.name}</h4>
        {venueAddress}
      </address>
    )
  }

  displayPlayers() {
    this.setState({
      displayPlayers: true
    })
  }

  renderPlayers() {
    const hasPlayers = this.props.artists
      .find(function(artist) { return artist.spotifyId })
    
    if (hasPlayers) {
      if (this.state.displayPlayers) {
        return this.props.artists
          .filter(function(artist) { return artist.spotifyId })
          .map(function(artist) {
            return (<SpotifyPlayer artistId={artist.spotifyId} artistName={artist.name} />)
          })
      }
      else {
        return (
          <span className="btn btn-success" onClick={this.displayPlayers}>Listen on Spotify</span>
        )
      }
    }
  }

  renderDate() {
    const date = moment(this.props.date, "YYYY-MM-DD")
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
        <span className="label label-primary" key={tag}>{tag}</span>, " "
      ])})

    // const images = this.props.artists
    //   .filter(function(artist) { return artist.imageUrl; })
    //   .map(function(artist) { return (
    //     <img src={artist.imageUrl} alt={artist.name} className="img-circle"/>
    //   )})

    return (
      <div className="gig">
        {this.renderDate()}
        <h3>
          <div className="artists-names">{artists}</div>
        </h3>
        <div className="tags">{tags}</div>
        {this.renderVenue()}
        <div className="players">{this.renderPlayers()}</div>
        <div className="external-link"><a target="blank" href={this.props.uri}>Find out more</a></div>
      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gigs: []
    }
    this.refresh = this.refresh.bind(this)
    this.fetchNext = this.fetchNext.bind(this)
    this.updateResults = this.updateResults.bind(this)
    this.refresh()
  }

  updateResults(apiResponse) {
    this.setState({
      apiResponse: apiResponse,
      gigs: this.state.gigs.concat(apiResponse.gigs.map(
        function(gig) {
          return ( <Gig 
            artists={gig.artists} 
            venue={gig.venue}
            uri={gig.uri}
            tags={gig.tags}
            date={gig.date}
            key={gig.uri} /> )
        }
      ))
    })
  }

  refresh() {
    fetchJson(gigsApiUrl("london", moment.utc().format("YYYY-MM-DD"), null, "rock"))
      .then(this.updateResults)
  }

  fetchNext() {
    fetchJson(this.state.apiResponse.nextPage)
      .then(this.updateResults)
  }

  render() {
    return (
      <div id="main">
        <div id="gig-listing" className="col-12 col-sm-8 col-md-8 col-lg-6">
          <InfiniteScroll
            next={this.fetchNext}
            hasMore={!this.state.apiResponse || this.state.apiResponse.nextPage}
            refresh={this.ref}
            loader={<div className="infinite-scroll">Finding gigs...</div>}
            endMessage={<div className="infinite-scroll">That's all for now...</div>}>
            {this.state.gigs}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default App;
