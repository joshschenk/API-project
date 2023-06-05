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
        url: "https://www.petitehaus.com/wp-content/uploads/2022/03/25262646-60CA-4455-8835-CD0A2E3BD546.jpeg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://www.petitehaus.com/wp-content/uploads/2022/03/B3C94037-F63C-4182-994A-5AB2AAC5D403.jpeg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://www.petitehaus.com/wp-content/uploads/2022/03/1FA74836-9E97-401C-BF32-DA3C3ABBF886.jpeg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://www.petitehaus.com/wp-content/uploads/2022/03/B40D90DB-7E80-4280-AF7B-625F87F81818.jpeg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://www.petitehaus.com/wp-content/uploads/2022/03/D42BB4DC-E60C-4D6E-816C-7C6C9A395343.jpeg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://www.travelandleisure.com/thmb/GGojmJlxry9Zd_23-1rIgogPwxY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/art-institute-chicago-exterior_CHIMUSEUMS0822-67f837274c8e4074ad931d6a9ec0750a.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://www.beauchamp.com/_wp/wp-content/uploads/2016/12/Luxury-Villa-in-Mougins.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://www.beauchamp.com/_wp/wp-content/uploads/2016/12/Fantastic-Contemporary-Villa-in-Cannes.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://www.beauchamp.com/_wp/wp-content/uploads/2016/12/Exceptional-Contemporary-Property-Ramatuelle.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://www.beauchamp.com/_wp/wp-content/uploads/2016/12/Stylish-Villa-Close-to-the-Beach-in-Saint-Tropez-.jpg",
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
