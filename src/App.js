import React, { Component } from 'react';
import './App.css';

import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Calendar, DateRange} from 'react-date-range';


// const backendBaseUrl = "http://localhost:5000/"
const backendBaseUrl = "https://gigsintown.herokuapp.com/"


Array.prototype.add = function(element) {
  return this.indexOf(element) === -1
    ? [].concat(this, [element])
    : this
};


const allTags = {
  "2-step"           : "2-step",
  "acappella"        : "Acappella",
  "acid house"       : "Acid house",
  "acid jazz"        : "Acid jazz",
  "acid rock"        : "Acid rock",
  "acid techno"      : "Acid techno",
  "acoustic"         : "Acoustic",
  "afrobeat"         : "Afrobeat",
  "alternative"      : "Alternative",
  "ambient"          : "Ambient",
  "americana"        : "Americana",
  "anti-folk"        : "Anti-folk",
  "art rock"         : "Art rock",
  "avant-garde"      : "Avant-garde",
  "big beat"         : "Big beat",
  "black metal"      : "Black metal",
  "bluegrass"        : "Bluegrass",
  "blues"            : "Blues",
  "bossa nova"       : "Bossa Nova",
  "britpop"          : "Britpop",
  "chill-out"        : "Chill-out",
  "country"          : "Country",
  "dance"            : "Dance",
  "dancehall"        : "Dancehall",
  "dark-wave"        : "Dark-wave",
  "death metal"      : "Death metal",
  "deep house"       : "Deep house",
  "disco"            : "Disco",
  "doom"             : "Doom",
  "downtempo"        : "Downtempo",
  "dream pop"        : "Dream pop",
  "drum and bass"    : "Drum and bass",
  "dub"              : "Dub",
  "dubstep"          : "Dubstep",
  "electronic"       : "Electronic",
  "experimental"     : "Experimental",
  "flamenco"         : "Flamenco",
  "folk"             : "Folk",
  "funk"             : "Funk",
  "fusion"           : "Fusion",
  "garage"           : "Garage",
  "glam"             : "Glam",
  "glitch"           : "Glitch",
  "goa trance"       : "Goa trance",
  "gospel"           : "Gospel",
  "gothic"           : "Gothic",
  "grime"            : "Grime",
  "grindcore"        : "Grindcore",
  "grunge"           : "Grunge",
  "hardcore"         : "Hardcore",
  "hard rock"        : "Hard rock",
  "metal"            : "Metal",
  "hip hop/rap"      : "Hip hop/Rap",
  "house"            : "House",
  "indie"            : "Indie",
  "industrial"       : "Industrial",
  "instrumental"     : "Instrumental",
  "jazz"             : "Jazz",
  "jingle"           : "Jingle",
  "krautrock"        : "Krautrock",
  "latin"            : "Latin",
  "lounge"           : "Lounge",
  "mambo"            : "Mambo",
  "math rock"        : "Math rock",
  "minimal"          : "Minimal",
  "new-wave"         : "New-wave",
  "noise"            : "Noise",
  "opera"            : "Opera",
  "orchestra"        : "Orchestra",
  "pop"              : "Pop",
  "post-punk"        : "Post-punk",
  "post-rock"        : "Post-rock",
  "progressive"      : "Progressive",
  "psychedelic"      : "Psychedelic",
  "psy-trance"       : "Psy-trance",
  "punk"             : "Punk",
  "reggae"           : "Reggae",
  "reggaeton"        : "Reggaeton",
  "rock"             : "Rock",
  "rock and roll"    : "Rock and roll",
  "rockabilly"       : "Rockabilly",
  "roots"            : "Roots",
  "r&b"              : "RnB",
  "shoegaze"         : "Shoegaze",
  "ska"              : "Ska",
  "singer-songwriter": "Singer-songwriter",
  "soul"             : "Soul",
  "space rock"       : "Space rock",
  "stoner"           : "Stoner",
  "surf"             : "Surf",
  "swing"            : "Swing",
  "synthpop"         : "Synthpop",
  "synthwave"        : "Synthwave",
  "techno"           : "Techno",
  "tekno"            : "Tekno",
  "thrash metal"     : "Thrash metal",
  "trip hop"         : "Trip hop",
  "underground"      : "Underground",
  "world music"      : "World music"
}


function fetchJson(url) {
  return fetch(url).then((resp) => resp.json())
}

function gigsApiUrl(location, startDate, endDate, query, tags) {
  return backendBaseUrl + "api/gigs?pageSize=20" +
    (location ? "&location=" + encodeURIComponent(location) : "") +
    (startDate ? "&startDate=" + startDate.format("YYYY-MM-DD") : "") +
    (endDate ? "&endDate=" + endDate.format("YYYY-MM-DD") : "") +
    (query ? "&query=" + encodeURIComponent(query) : "") +
    (tags.length ? "&tags=" + encodeURIComponent(tags.join(",")) : "")
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


class TagSelector extends Component {
  constructor(props) {
    super(props)
    this.onChange = props.onChange
    this.allItems = this.props.allItems || {}

    this.state = {
      items: this.props.items || [],
      matches: []
    }
  }

  render() {
    const selected = this.state.items
      .map((item) => [
        <button className="btn btn-primary"
          key={"selected-" + item}
          onClick={(event) => {
            const items = this.state.items.filter((x) => x !== item)
            this.setState({items: items})
            this.onChange(items)
          }}>
            {this.allItems[item]}
        </button>,
        " "
      ])

    const matches = this.state.matches
      .filter((x) => this.state.items.indexOf(x) === -1)
      .map((item) => [
        <span
          key={"match-" + item}
          className="btn btn-light"
          onClick={(event) => {
            const items = this.state.items.add(item)
            this.setState({items: items})
            this.onChange(items)
          }}>
            {this.allItems[item]}
        </span>,
        " "
      ])

    return (
      <div className="tag-selector form-group">
        <input className="form-control" type="text" placeholder={this.props.placeholder}
          onChange={(event) => {
            const needle = event.target.value
            const matches = !needle
              ? []
              : Object.keys(this.allItems)
                .filter((key) => this.allItems[key].toLowerCase().indexOf(needle) !== -1)
                .sort((a, b) => a.length - b.length)

              this.setState({matches: matches})
          }} />
        {selected} {matches}
      </div>
    )
  }
}


class GigSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: props.location || "london",
      startDate: props.startDate ||moment.utc(),
      endDate: props.endDate || null,
      query: props.query || null,
      tags: props.tags || []
    }
  }

  render() {
    const endDateForRanges = this.state.endDate
      ? this.state.endDate
      : this.state.startDate.clone().add(1, "week")

    return (
      <article id="filters">
        <div className="form-group calendars d-block d-lg-none">
          <Calendar
            date={this.state.startDate}
            minDate={moment.utc()}
            onChange={ (date) => this.setState({startDate: date}) }
          />
        </div>

        <div className="form-group calendars d-none d-lg-block">
          <DateRange
            minDate={moment.utc()}
            startDate={this.state.startDate}
            endDate={endDateForRanges}
            linkedCalendars={true}
            onChange={ (range) => this.setState({startDate: range.startDate, endDate: range.endDate}) }
          />
        </div>

        <div className="form-group query">
          <input
            type="text"
            className="form-control"
            placeholder="Search artist or venue"
            onChange={(event) => this.setState({query: event.target.value}) }/>
        </div>

        <div className="form-group tags">
          <TagSelector
            allItems={allTags}
            items={this.state.tags}
            placeholder="Search by tag"
            onChange={(tags) => this.setState({tags: tags})} />
        </div>

        <div className="form-group submit">
          <button onClick={ (event) => this.props.onSearch(
              this.state.location,
              this.state.startDate,
              this.state.endDate,
              this.state.query,
              this.state.tags
            )
          } id="submit-search" className="btn btn-primary">Find gigs!</button>
        </div>
      </article>
    )
  }
}


class GigListing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gigs: []
    }
    this.fetchNext = this.fetchNext.bind(this)
    this.appendResults = this.appendResults.bind(this)
  }

  appendResults(apiResponse) {
    this.setState({
      apiResponse: apiResponse,
      gigs: this.state.gigs.concat(apiResponse.gigs.map(
        function(gig) {
          return <Gig 
            artists={gig.artists} 
            venue={gig.venue}
            uri={gig.uri}
            tags={gig.tags}
            date={gig.date}
            key={gig.uri} />
        }
      ))
    })
  }

  fetchNext() {
    if (!this.state.loading) {
      this.setState({ loading: true })
      const url = this.state.apiResponse
        ? this.state.apiResponse.nextPage
        : this.props.apiUrl
      fetchJson(url)
        .then(this.appendResults)
        .then(() => {
          this.setState({ loading: false })
        })
    }
  }

  render() {
    return (
      <div id="gig-listing">
        <button className="btn btn-dark back-to-search" onClick={this.props.onSearch}>
          Back to search
        </button>
        <InfiniteScroll
          next={this.fetchNext}
          hasMore={!this.state.apiResponse || this.state.apiResponse.nextPage}
          loader={<article>Finding gigs...</article>}
          endMessage={<article>That's all, refine your search to find more gigs</article>}>
          {this.state.gigs}
        </InfiniteScroll>
      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
      startDate: null,
      endDate: null,
      query: null,
      tags: null,
      apiUrl: null,
      auth: null
    }
  }

  render() {
    function loginForm() {

    }

    function userImage() {
      return <img className="toggle-control" src={this.state.auth.user.pictureUrl} />
    }

    const content = this.state.apiUrl
      ? <GigListing
          onSearch={() => this.setState({apiUrl: null})} key={this.state.apiUrl} apiUrl={this.state.apiUrl}/>
      : <GigSearch
          key="search"
          onSearch={(location, startDate, endDate, query, tags) => 
            this.setState({
              location: location,
              startDate: startDate,
              endDate: endDate,
              query: query,
              tags: tags,
              apiUrl: gigsApiUrl(location, startDate, endDate, query, tags)
            })
          }
          location={this.state.location}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          query={this.state.query}
          tags={this.state.tags} />

    const navBarContent = null
    // const navBarContent = this.state.auth
    //   ? userImage.bind(this)()
    //   : loginForm.bind(this)()

    return ([
      <header>
        <nav className="navbar navbar-dark fixed-top" id="header">
          <div className="container">
            <a className="navbar-brand" href="#">Gigme.IN</a>
            {navBarContent}
          </div>
        </nav>
      </header>
    ,
    <div className="container">
        <div className="row">
          <nav className="col col-md-4 hidden-sm hidden-xs">
          </nav>
          <main className="col col-12 col-md-8">
            {content}
          </main>
        </div>
      </div>
    ])
  }
}

export default App;
