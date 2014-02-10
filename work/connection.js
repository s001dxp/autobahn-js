///////////////////////////////////////////////////////////////////////////////
//
//  AutobahnJS - http://autobahn.ws, http://wamp.ws
//
//  A JavaScript library for WAMP ("The Web Application Messaging Protocol").
//
//  Copyright (C) 2011-2014 Tavendo GmbH, http://tavendo.com
//
//  Licensed under the MIT License.
//  http://www.opensource.org/licenses/mit-license.php
//
///////////////////////////////////////////////////////////////////////////////

var session = require('./session.js');
var websocket = require('./websocket.js');

var Connection = function (options) {

   var self = this;

   self._options = options;
   self._websocket = new websocket.WebSocket(self._options.url, ['wamp.2.json']);
};


Connection.prototype.add = function (transport, options) {
   var self = this;

   self._transports.push({transport: transport, options: options});
};

Connection.prototype.open = function (options) {

   var self = this;

   var _session = new session.Session(self._websocket.create(), {});

   _session.onconnect = function () {
      console.log("1");
      _session.join(self._options.realm);
   };

   _session.onjoin = function () {
      console.log("2");
      if (self.onopen) {
         self.onopen(_session);
      }
   };

   _session.onleave = function () {
      console.log("dfsd");
      this.disconnect();
   }

   _session.ondisconnect = function () {
      console.log("transport closed");
      if (self.onclose) {
         self.onclose();
      }
   };

   //console.log(self._transports[0]);

   //_session.connect(self._transports[0].transport.create());
   //_session.connect(self._websocket.create());

   console.log("5");
};


exports.Connection = Connection;


/*
function main (session) {

   session.call('com.myapp.time').then(...)

   session.publish('com.myapp.topic1', [1, 2, 'hello'], null, {acknowledge: true});

   session.publish({topic: 'com.myapp.topic1', acknowledge: true}, 'hello');
   session.publish({topic: 'com.myapp.topic1', acknowledge: true}, [1, 2, 'hello']);

   session.publish('com.myapp.topic1', {acknowledge: true}, [1, 2, 'hello']);
}

var transport = autobahn.FallbackTransport({appname: 'com.myapp.ultimate'});

transport.add(new autobahn.WebSocket(false, 'ws://127.0.0.1:9000/', ['wamp.2.json']), {retries: 5});
transport.add(new autobahn.LongPoll(), {retries: 3});
transport.add(new autobahn.Alert({redirect: 'http://fallback.com/myapp'});

transport.onopen = function (session) {
   main(session);
};

transport.onretry = function (retry) {
   next();
};

transport.onclose = function (why) {
};

transport.open({realm: 'realm1'});

transport.next();

transport.close();
*/