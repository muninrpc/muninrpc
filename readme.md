<div align="center"><img src="https://images-na.ssl-images-amazon.com/images/I/515xyoCME2L._SX425_.jpg" width="206" height="130" title="MuninRPC"></div>
<h1 align="center">- MuninRPC -</h1>
<h4 align="center"><strong>Quoth the raven:</strong> "I can mock my gRPC calls!"</h4>

<br/>
<br/>

MuninRPC is a GUI client for RPC services.
  - Send requests to a gRPC service.
  - Upload your proto files, select a service, configure your message, and go.
  - This is an early build. Development is in progress! 
  

Built on the shoulders of giants:

  - Inspired by Postman and [BloomRPC](https://github.com/uw-labs/bloomrpc).
  - Powered by the [protobuf.js](https://github.com/protobufjs/protobuf.js) and [node-grpc](https://github.com/grpc/grpc-node) libraries.
  - Wrapped in [Electron](http://electronjs.org/). 

## Features

  - Supports unary, server-push, client-push, and bi-directional requests.
  - Keeps a record of your outgoing and incoming messages.
  - Large proto file? No problem. Search your messages and services for what you need.
  - Clean, beautiful, tabbed interface.


_


### Installation & Use

We have compiled binaries available:

Windows | [Mac](https://s3-us-west-1.amazonaws.com/elasticbeanstalk-us-west-1-763399177644/munin-rpc.zip) | Linux


_


MuninRPC can be compiled from source. It requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the application.

```sh
$ cd MuninRPC
$ npm install
$ npm start
```

Start up a local grpc server for testing. A compatible sample proto file is included in "./\_\_tests\_\_/grpc-server/protos".

```sh
$ npm run grpcserver
```

Looking to contribute? You might be interested in our tests.

```sh
$ npm run test
```

_

##### Contributors:

Sterling Deng *@sterlingdeng* 

Ray Yao *@RocaRay*

Ed Ryan *@15ryane*

Raven motif from [Silver Spiral](https://www.zazzle.com/mbr/238845459138370735).
