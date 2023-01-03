## **Section 02: A Mini-Microservices App**

## Table of Contents
- [**Section 02: A Mini-Microservices App**](#section-02-a-mini-microservices-app)
- [Table of Contents](#table-of-contents)
  - [App Overview](#app-overview)
  - [Project Setup](#project-setup)
  - [Posts Service Creation](#posts-service-creation)
  - [Implementing a Comments Service](#implementing-a-comments-service)
  - [React Project Setup](#react-project-setup)
  - [Request Minimization Strategies](#request-minimization-strategies)
  - [An Async Solution](#an-async-solution)
  - [Common Questions Around Async Events](#common-questions-around-async-events)
  - [Event Bus Overview](#event-bus-overview)
  - [A Basic Event Bus Implementation](#a-basic-event-bus-implementation)
  - [Emitting Post Creation Events](#emitting-post-creation-events)
  - [Emitting Comment Creation Events](#emitting-comment-creation-events)
  - [Receiving Events](#receiving-events)
  - [Creating the Data Query Service](#creating-the-data-query-service)
  - [Parsing Incoming Events](#parsing-incoming-events)
  - [Using the Query Service](#using-the-query-service)
  - [Adding a Simple Feature](#adding-a-simple-feature)
  - [Issues with Comment Filtering](#issues-with-comment-filtering)
  - [A Second Approach](#a-second-approach)
  - [How to Handle Resource Updates](#how-to-handle-resource-updates)
  - [Creating the Moderation Service](#creating-the-moderation-service)
  - [Adding Comment Moderation](#adding-comment-moderation)
  - [Handling Moderation](#handling-moderation)
  - [Updating Comment Content](#updating-comment-content)
  - [Dealing with Missing Events](#dealing-with-missing-events)

### App Overview

Goals

- Get a taste of a microservices architecture
- Build as much as possible from scratch

![](images/app-overview-1.jpg)
![](images/app-overview-2.jpg)

What services should we create?

- For now, we will create one separate service for each resource in our app

![](images/what-services.jpg)
![](images/service-per-resource.jpg)

**[⬆ back to top](#table-of-contents)**

### Project Setup

![](images/project-setup.jpg)


- Generate a new React App using Create-React-App
- Create an Express-based project for the Posts Service
- Create an Express-based project for the Comments Service



#### Initial App Setup

    $ npm install -g nodemon (install nodemon if don't have)
</br>
Create React client

    $ cd app
    $ npx create-react-app client

<br/>
Create post service

    $ cd app
    $ mkdir posts
    $ cd posts
    $ npm init -y
    $ npm install --save express cors axios

<br/>
Create comments service

    $ cd app
    $ mkdir comments
    $ cd comments
    $ npm init -y
    $ npm install --save express cors axios

</br>

#### Install this project and running

Install React client

    $ cd client
    $ npm install
    $ npm start

Install post service

    $ cd posts
    $ npm install
    $ npm start

Install comments service

    $ cd comments
    $ npm install
    $ npm start

Install event bus

    $ cd event-bus
    $ npm install
    $ npm start

Install moderation service

    $ cd moderation
    $ npm install
    $ npm start

Install query service

    $ cd query
    $ npm install
    $ npm start

**[⬆ back to top](#table-of-contents)**

### Posts Service Creation

![](images/posts-service.jpg)

**[⬆ back to top](#table-of-contents)**

### Implementing a Comments Service

![](images/comments-service.jpg)
![](images/comments-by-post-id.jpg)

**[⬆ back to top](#table-of-contents)**

### React Project Setup

![](images/react-client.jpg)

**[⬆ back to top](#table-of-contents)**

### Request Minimization Strategies

![](images/array-of-requests.jpg)
![](images/monoliths-solution.jpg)
![](images/microservices-solution.jpg)
![](images/sync-communication.jpg)

Notes on Sync Communication

| Pro                              | Con                                                           |
| -------------------------------- | ------------------------------------------------------------- |
| Conceptually easy to understand! | Introduces a dependency between services                      |
|                                  | If any inter-service request fails, the overall request fails |
|                                  | The entire request is only as fast as the slowest request     |
|                                  | Can easily introduce webs of requests                         |

**[⬆ back to top](#table-of-contents)**

### An Async Solution

![](images/async-communication.jpg)
![](images/async-communication-step-1.jpg)
![](images/async-communication-step-2.jpg)
![](images/async-communication-step-3.jpg)
![](images/async-communication-step-4.jpg)
![](images/async-communication-step-5.jpg)

Notes on Async Communication

| Pros                                                   | Cons                 |
| ------------------------------------------------------ | -------------------- |
| Query Service has zero dependencies on other services! | Data duplication.    |
| Query Service will be extremely fast!                  | Harder to understand |

**[⬆ back to top](#table-of-contents)**

### Common Questions Around Async Events


Wait, so you're saying we need to create a new service every time we need to join some data?!?!?!?!?!?
> Absolutely not!  In reality, might not even have posts and comments in separate services in the first place

Who cares that each service is independent?
> Independent services + the reliability that brings is one of the core reasons of using microservices in the first place

This is so over the top complicated for little benefit
> Seems that way now!  Adding in some features starts to get really easy when we use this architecture

This system won't correctly in the following scenario....
> There are some very special things we need to consider with this design.  I've got solutions for most (maybe?) of the concerns you may have

**[⬆ back to top](#table-of-contents)**

### Event Bus Overview

Event Bus

- Many different implementations. RabbitMQ, Kafka, NATS...
- Receives events, publishes them to listeners
- Many different subtle features that make async communication way easier or way harder
- We are going to build our own event bus using Express. It will not implement the vast majority of features a normal bus has.
- Yes, for our next app we will use a production grade, open source event bus

![](images/event-bus-overview-1.jpg)

**[⬆ back to top](#table-of-contents)**

### A Basic Event Bus Implementation

![](images/event-bus-overview-2.jpg)

```javascript
// event-bus/index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const event = req.body;

  axios.post('http://localhost:4000/events', event);
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
```

**[⬆ back to top](#table-of-contents)**

### Emitting Post Creation Events

![](images/emit-post-creation-events.jpg)

```javascript
// posts/index.js
const posts = {};
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title
  };

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);
});
```

**[⬆ back to top](#table-of-contents)**

### Emitting Comment Creation Events

![](images/emit-comment-creation-events.jpg)

```javascript
// comments/index.js
const commentsByPostId = {};
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  });

  res.status(201).send(comments);
});
```

**[⬆ back to top](#table-of-contents)**

### Receiving Events

```javascript
// posts/index.js
// comments/index.js
app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});
```

**[⬆ back to top](#table-of-contents)**

### Creating the Data Query Service

![](images/query-service.jpg)

```javascript
// query/index.js
app.get('/posts', (req, res) => {});
app.post('/events', (req, res) => {});
```

**[⬆ back to top](#table-of-contents)**

### Parsing Incoming Events

```javascript
// query/index.js
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content });
  }

  console.log(posts);

  res.send({});
});
```

**[⬆ back to top](#table-of-contents)**

### Using the Query Service

![](images/react-query-service.jpg)

**[⬆ back to top](#table-of-contents)**

### Adding a Simple Feature

Feature Request

- Add in comment moderation.
- Flag comments that contain the word 'orange'.

Feature Clarifications

- Super easy to implement in the React app, but not if the filter list changes frequently
- Super easy to implement in the existing comments service, but let's assume we want to add a new service
- It might take a long time for the new service to moderate a comment.

![](images/add-filter-feature.jpg)
![](images/comment-new-shape.jpg)

**[⬆ back to top](#table-of-contents)**

### Issues with Comment Filtering

![](images/moderation-service-1.jpg)

**[⬆ back to top](#table-of-contents)**

### A Second Approach

![](images/moderation-service-2.jpg)

- The query service is about presentation logic
- It is joining two resources right now (posts and comments), but it might join 10!
- Does it make sense for a presentation service to understand how to process a very precise update?

![](images/process-update.jpg)
![](images/query-service-update.jpg)
![](images/multi-services-update.jpg)

**[⬆ back to top](#table-of-contents)**

### How to Handle Resource Updates

![](images/handle-resources-update.jpg)
![](images/moderation-service-3.jpg)

**[⬆ back to top](#table-of-contents)**

### Creating the Moderation Service

```javascript
// moderation/index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
```

**[⬆ back to top](#table-of-contents)**

### Adding Comment Moderation

![](images/comment-created.jpg)

**[⬆ back to top](#table-of-contents)**

### Handling Moderation

![](images/comment-moderated.jpg)

**[⬆ back to top](#table-of-contents)**

### Updating Comment Content

![](images/comment-updated.jpg)

**[⬆ back to top](#table-of-contents)**

### Dealing with Missing Events

![](images/missing-1.jpg)
![](images/missing-2.jpg)
![](images/solution-1.jpg)
![](images/solution-2.jpg)
![](images/solution-3.jpg)

**[⬆ back to top](#table-of-contents)**