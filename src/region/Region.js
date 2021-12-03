import React from 'react';

class Region extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      kind: "province",
      name: "Indonesia",
      id: 0,
      previous: [{
        kind: "province",
        id: 0,
      }],
    };
    this.baseURI = "https://api.panenpa.com/api/v1/region/";
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchData(endpoint) {
    fetch(endpoint)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  fetchItems(kind = "province", id = 0, name = null) {
    if (id && kind === "province") {
      let previous = this.state.previous;
      previous.push(this.state);
      this.setState({
        isLoaded: false,
        kind: "regency",
        name: name,
        id: id,
        previous: previous
      }, () => {
        const endpoint = this.baseURI + this.state.kind + "/in/" + id;
        this.fetchData(endpoint);
      });
    } else if (id && kind === "regency") {
      let previous = this.state.previous;
      previous.push(this.state);
      this.setState({
        isLoaded: false,
        kind: "district",
        name: name,
        id: id,
        previous: previous
      }, () => {
        const endpoint = this.baseURI + this.state.kind + "/in/" + id;
        this.fetchData(endpoint);
      });
    } else if (id && kind === "district") {
      let previous = this.state.previous;
      previous.push(this.state);
      this.setState({
        isLoaded: false,
        kind: "village",
        name: name,
        id: id,
        previous: previous
      }, () => {
        const endpoint = this.baseURI + this.state.kind + "/in/" + id;
        this.fetchData(endpoint);
      });
    } else if (kind === "village") {
      // do nothing
    } else {
      this.fetchData(this.baseURI + this.state.kind);
    }
  }

  fetchPrevious(previous) {
    const { kind, name, id } = previous;
    this.setState({
      isLoaded: false,
      kind: kind,
      id: id,
      name: name
    }, () => {
      if (id) {
        const endpoint = this.baseURI + kind + "/in/" + id;
        this.fetchData(endpoint);
      } else {
        this.fetchData(this.baseURI + kind);
      }
    });
  }

  ucwords(str) {
    return str.toLowerCase().replace(/(?<= )[^\s]|^./g, a=>a.toUpperCase());
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      let previousButton;
      if (this.state.previous.length > 1) {
        previousButton = <button onClick={() => this.fetchPrevious(this.state.previous.pop())}>&laquo; Go Back</button>;
      }
      return (
        <div>
          <h5>{this.ucwords(this.state.kind)} in {this.ucwords(this.state.name)}</h5>
          <ul>
            {items.map(item => (
              <li key={item.id} onClick={() => this.fetchItems(this.state.kind, item.id, item.name)}>
                <button>{item.id} - {item.name}</button>
              </li>
            ))}
          </ul>
          {previousButton}
        </div>
      );
    }
  }
}

export default Region;
