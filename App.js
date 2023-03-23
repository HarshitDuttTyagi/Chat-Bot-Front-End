import './App.css';
import React, {Component} from 'react';
import axios from "axios";

 class Chatbot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    // Add initial message from bot to messages list
    this.setState({
      messages: [...this.state.messages, {
        sender: "bot",
        message: "Welcome to StarTrek Bot! I answer questions based on dataset of all StarTrek movies and TV show scripts. Here are a few things you can ask me:"
      }, {
        //Replace message with 3 star trek questions
        sender: "bot",
        message: "->  What is the name of the ship in Star Trek?"
      },{
        sender: "bot",
        message:   "->  Who is the captain of the USS Enterprise?"
      }
    ]
    });
  }

  handleSubmit =(event)=> {
    event.preventDefault();
    const userMessage = event.target.elements.userInput.value
    //Set messages state
    this.setState({ messages: [...this.state.messages, { type: 'user', message: userMessage }] });
    event.target.elements.userInput.value = ''
	   this.sendMessage(userMessage)
  }

  sendMessage = async (userMessage) => {
    const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const model = 'gpt-3.5-turbo';
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    };
    
    const data = {
      'model': model,
      'messages': [{"role": "user", "content": userMessage}]
    };
    
    axios.post(openaiEndpoint, data, { headers })
    .then(response => {
      const chatResponse = response.data.choices[0].message.content;
      this.setState({
        messages: [...this.state.messages, {
          sender: "bot",
          message: chatResponse
        }]
      });
      console.log(chatResponse);
      // Do something with the chat response
    })
    .catch(error => {
      console.error(error);
      // Handle the error
    });
  };
  
  
  render(){
    return (
      <div className="chatbot">
        <div className="chat-window">
          {this.state.messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.message}
            </div>
          ))}
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="userInput" placeholder="Type your message here" />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }

 }

export default Chatbot;
