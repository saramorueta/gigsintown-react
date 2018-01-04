import React, { Component } from 'react';
import './App.css';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DateRangePicker } from 'react-dates';

function fetchJson(url) {
  return fetch(url).then((resp) => resp.json())
}

function gigsApiUrl(location, startDate, endDate, query, tags) {
  return "http://localhost:9000/api/gigs?pageSize=20" +
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
      ? <a href={googleMapsUrl(this.props.venue)} target="blank">{this.props.venue.address}</a>
      : null

    return (
      <address className="venue">
        <h4>{this.props.venue.name}</h4>
        {venueAddress}
      </address>
    )
  }

  renderPlayers() {
    const hasPlayers = this.props.artists
      .find(function(artist) { return artist.spotifyId })
    
    if (hasPlayers) {
      if (this.state.displayPlayers) {
        return this.props.artists
          .filter(function(artist) { return artist.spotifyId })
          .map(function(artist) {
            return (<SpotifyPlayer key={artist.spotifyId} artistId={artist.spotifyId} artistName={artist.name} />)
          })
      }
      else {
        return (
          <span className="btn btn-success" onClick={() => this.setState({displayPlayers: true})}>Listen on Spotify</span>
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


class GigSearch extends Component {
  constructor(props) {
    super(props)
    this.onSearch = props.onSearch
    this.state = {
      location: "london",
      startDate: moment.utc(),
      endDate: null,
      query: null,
      tags: []
    }
  }

  render() {
    return (
      <div id="filters" className="col-12 col-md-6">
        <div className="form-group">
          <DateRangePicker
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            renderCalendarInfo={false}
            hideKeyboardShortcutsPanel={true}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search artist or venue"
            onChange={(event) => this.setState({query: event.target.value}) }/>
        </div>

        <div className="form-group">
          <button onClick={ (event) => this.onSearch(gigsApiUrl(
              this.state.location,
              this.state.startDate,
              this.state.endDate,
              this.state.query,
              this.state.tags
            ))
          } id="submit-search" className="btn btn-primary">Find gigs!</button>
        </div>
      </div>
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
    fetchJson(props.apiUrl)
      .then(this.appendResults)
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
    fetchJson(this.state.apiResponse.nextPage)
      .then(this.appendResults)
  }

  render() {
    return (
      <div id="gig-listing" className="col-12 col-md-6">
        <InfiniteScroll
          next={this.fetchNext}
          hasMore={!this.state.apiResponse || this.state.apiResponse.nextPage}
          loader={<div className="infinite-scroll">Finding gigs...</div>}
          endMessage={<div className="infinite-scroll">
            <p>That's all for now...</p>
          </div>}>
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
      apiUrl: null
    }
  }

  render() {
    return (
      <div>
        <GigSearch onSearch={(apiUrl) => this.setState({apiUrl: apiUrl})} />
        {this.state.apiUrl ? <GigListing key={this.state.apiUrl} apiUrl={this.state.apiUrl}/> : null}
      </div>
    )
    // return this.state.apiUrl
    //   ? <GigListing key={this.state.apiUrl} apiUrl={this.state.apiUrl}/>
    //   : <GigSearch onSearch={(apiUrl) => this.setState({apiUrl: apiUrl})} />
  }
}

export default App;
