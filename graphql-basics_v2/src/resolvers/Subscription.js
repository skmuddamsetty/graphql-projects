const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        // publishing the data using the publish method
        // first argument is the channel name
        // second argument is the data
        // channel name should match with the channel name given to pubsub.asyncIterator
        pubsub.publish('count', {
          count,
        });
      }, 1000);
      // creating a channel name with "count"
      return pubsub.asyncIterator('count');
    },
  },
};

export { Subscription as default };
