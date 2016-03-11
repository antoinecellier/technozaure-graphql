/* Connexion avec le serveur GraphQL*/
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8080/graphql')
);

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

/* Conteneur Relay du composant */
const componentContainer = Relay.createContainer(App, {
  fragments: {
    posts: () => Relay.QL`
      query {
        posts {
          title
          category
        }
      }
    `,
  },
});

/* Conteneur Relay de l'application */
ReactDOM.render(
  <Relay.RootContainer Component={componentContainer} />,
  document.getElementById('root')
)
