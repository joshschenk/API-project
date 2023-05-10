'use strict';

/** @type {import('sequelize-cli').Migration} */


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://chipublib.bibliocommons.com/events/uploads/images/full/6314ef45d17ac782240765bc7e5489b8/harold-washington-library-center.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/b8/2f/4a/winter-garden.jpg?w=1100&h=-1&s=1",
        preview: false
      },
      {
        spotId: 2,
        url: "https://www.travelandleisure.com/thmb/GGojmJlxry9Zd_23-1rIgogPwxY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/art-institute-chicago-exterior_CHIMUSEUMS0822-67f837274c8e4074ad931d6a9ec0750a.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://assets.chicagoparkdistrict.com/s3fs-public/styles/16_9_100_width/public/images/news/Portage%20Outdoor%20Pool.jpg?itok=N15Kn_Zf",
        preview: true
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
