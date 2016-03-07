import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import { graphql } from 'graphql';

GraphiQL.Logo = class Logo extends Component {
  render() {
    let style = {
      fontWeight: 800,
      fontSize: 16,
      color: "#252525"
    };

    return (
      <span style={style}>Learn GraphQL Sandbox</span>
    );
  }
}

export default class App extends Component {
  fetchData({query, variables}) {
    let queryVariables = {};
    try {
      queryVariables = JSON.parse(variables);
    } catch(ex) {}

    return fetch('/graphql', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        queryVariables
      })
    }).then(function(response) {
      return response.json();
    })
  }

  render() {
    return (
      <GraphiQL fetcher={this.fetchData} />
    );
  }
}
