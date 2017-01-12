import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = { todos: {} };

    this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.selectTodo = this.selectTodo.bind(this);
  }

  componentDidMount() {
    axios({
      url: '/todos.json',
      baseURL: 'https://todo-793dc.firebaseio.com/',
      method: 'GET'
    })
    .then((res) => {
      this.setState({ todos: res.data })
    })
    .catch((err) => {
      console.log(err);
    })

  }
  createTodo(todoText) {
    // your code goes here
    let newTodo = { title: todoText, createdAt: new Date };
    axios({
      url: '/todos.json',
      baseURL: 'https://todo-793dc.firebaseio.com/',
      method: 'POST',
      data: newTodo
    })
    .then((res) => {
      let todos = this.state.todos;
      todos[res.data.time] = newTodo;
      // set the state after pushing the todo item to firebase
      this.setState({
        todos
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  deleteTodo(todoId) {
    axios({
      url: `/todos/${todoId}.json`,
      baseURL: 'https://todo-793dc.firebaseio.com/',
      method: "DELETE"
    }).then((response) => {
      let todos = this.state.todos;
      delete todos[todoId];
      this.setState({ todos: todos });
    }).catch((error) => {
      console.log(error);
    });
  }

  selectTodo(todoId) {
    this.setState({ currentTodo: todoId });
  }

  renderSelectedTodo() {
    let content;

    if (this.state.currentTodo) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      content =  (
        <div>
          <h1>{currentTodo.title}</h1>
        </div>
      );
    }

    return content;
  }

  handleNewTodoInput(event) {
    if (event.charCode === 13) {
      this.createTodo(event.target.value);
      event.target.value = "";
    }
  }

  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <input className="w-100" placeholder="What do you have to do?" onKeyPress={ this.handleNewTodoInput } />
      </div>
    );
  }

   renderTodoList() {
    let todoElements = [];

    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2" onClick={ () => this.selectTodo(todoId) }>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button
            className="ml-4 btn btn-link"
            onClick={ () => { this.deleteTodo(todoId) } }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
          <div className="col-6 px-4">
            {this.renderSelectedTodo()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

