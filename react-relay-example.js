/* Connexion avec le serveur GraphQL*/
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8080/graphql')
);

/* Requête GraphQL */
const query = {
  name: 'AppQueries',
  queries: {
    Post: () => Relay.QL`query{ user }`,
  },
};

/* Conteneur Relay du composant */
const componentContainer = Relay.createContainer(App, {
  fragments: {
    posts: () => Relay.QL`
      fragment on Post {
        title
        category
      }
    `,
  },
});

/* Déclaration du composant */
class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.posts(p =>
            <h1>{p.title}</h1>
            <i>{p.category}</i>
          )}
        </ul>
      </div>
    )
  }
}

/* Conteneur Relay de l'application */
ReactDOM.render(
  <Relay.RootContainer Component={componentContainer} route={query} />,
  document.getElementById('root')
)
