import React from "react";
import axios from "axios";
import UserList from "./components/UserList/UserList";
import UserForm from "./components/UserForm/UserForm";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./App.css";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      currentUser: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      const users = response.data.map((user) => ({
        id: user.id,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1] || "",
        email: user.email,
        department: "Unknown",
      }));
      this.setState({ users });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleAddOrUpdateUser = (user) => {
    if (user.id) {
      this.setState((prevState) => ({
        users: prevState.users.map((u) => (u.id === user.id ? user : u)),
        currentUser: null,
      }));
    } else {
      user.id = this.state.users.length + 1;
      this.setState((prevState) => ({
        users: [...prevState.users, user],
      }));
    }
  };

  handleEditUser = (user) => {
    this.setState({ currentUser: user });
  };

  handleDeleteUser = (id) => {
    this.setState((prevState) => ({
      users: prevState.users.filter((user) => user.id !== id),
    }));
  };

  render() {
    const { users, currentUser, error } = this.state;

    return (
      <ErrorBoundary>
        <div className="App">
          <h1 className="app-title">User Management System</h1>
          {error && <p className="error">Error: {error}</p>}
          <UserForm user={currentUser} onSubmit={this.handleAddOrUpdateUser} />
          <UserList users={users} onEdit={this.handleEditUser} onDelete={this.handleDeleteUser} />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
