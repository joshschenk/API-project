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

    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 Fake Street',
        city: "Chicago",
        state: "Illinois",
        country: "USA",
        lat: 41.8781,
        lng: 87.6298,
        name: "Library",
        description: "Lots of books",
        price: 240
      },
      {
        ownerId: 1,
        address: '2 Fake Street',
        city: "Chicago",
        state: "Illinois",
        country: "USA",
        lat: 42.8781,
        lng: 88.6298,
        name: "Museum",
        description: "Lots of paitings",
        price: 230
      },

      {
        ownerId: 2,
        address: '2 Unreal Street',
        city: "Chicago",
        state: "Illinois",
        country: "USA",
        lat: 51.8781,
        lng: 97.6298,
        name: "Pool",
        description: "Very wet",
        price: 240
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});

  }
};
