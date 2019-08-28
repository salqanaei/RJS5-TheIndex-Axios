import React, { Component } from "react";

import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true
  };

  fetchAuthors = async () => {
    try {
      let response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      let authors = response.data;
      this.setState({
        authors: authors,
        filteredAuthors: authors,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    this.fetchAuthors();
  }

  selectAuthor = async authorid => {
    this.setState({ loading: true });
    try {
      let response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/" + authorid
      );
      console.log(response.data);
      let selectedauthor = response.data;
      this.setState({
        currentAuthor: selectedauthor,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else if (!this.state.loading) {
      return (
        <AuthorsList
          authors={this.state.filteredAuthors}
          selectAuthor={this.selectAuthor}
          filterAuthors={this.filterAuthors}
        />
      );
    } else {
      return <Loading />;
    }
  };

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
