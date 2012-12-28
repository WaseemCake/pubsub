var should = require('chai').should(),
    pubsub  = require('./');

it('publishes', function(done){

  var foo = pubsub();

  var i = 0;
  foo.subscribe(function(a, b){
    a.should.be.equal(3);
    b.should.be.equal(4);
    i++;
  });

  foo.subscribe(function(a, b){
    a.should.be.equal(3);
    b.should.be.equal(4);
    i++;
  });

  foo.subscribe(function(a, b){
    a.should.be.equal(3);
    b.should.be.equal(4);
    i.should.be.equal(2);
    done();
  });

  foo.publish(3, 4);

});

it('has subscription', function(done){

  function cb1(){}
  function cb2(){}
  function cb3(){}

  var foo = pubsub();

  foo.subscribe(cb1);
  foo.subscribe(cb2);
  foo.subscribe(cb3);

  foo.subscribers.length.should.be.equal(3);
  foo.subscribers[0].callback.should.be.equal(cb1);
  foo.subscribers[1].callback.should.be.equal(cb2);
  foo.subscribers[2].callback.should.be.equal(cb3);

  done();

});

it('has unsubscription', function(done){
  function cb1(){}
  function cb2(){}
  function cb3(){}

  var foo = pubsub();

  foo.subscribe(cb1);
  foo.subscribe(cb2);
  foo.subscribe(cb3);

  foo.unsubscribe(cb2);

  foo.subscribers.length.should.be.equal(3);
  foo.subscribers[0].callback.should.be.equal(cb1);
  should.not.exist(foo.subscribers[1]);
  foo.subscribers[2].callback.should.be.equal(cb3);

  done();
});

it('can combine multiple pubsubs', function(done){
  var a = pubsub(),
      b = pubsub(),
      c = pubsub(),
      d = pubsub(),

      e = pubsub.on(a, b, function(changed){
        changed.length.should.be.equal(2);
        changed[0].pubsub.should.be.equal(a);
        changed[1].pubsub.should.be.equal(c);

        calledOnce.should.be.true;
        calledOnce = false;

        done();
      }),

      calledOnce = true;

  e.subscribeTo(c, d);
  e.unsubscribeTo(b);
  e.unsubscribeTo(d);

  a.publish();
  b.publish();
  c.publish();

});
