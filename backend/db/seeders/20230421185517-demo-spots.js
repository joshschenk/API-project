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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tristique ante est. Nunc congue, justo ac sollicitudin molestie, nunc dolor euismod tellus, quis viverra enim felis vitae quam. Vivamus eget feugiat sapien. Praesent justo lacus, auctor eu varius et, malesuada sit amet metus. Nam ultricies urna purus, et dictum nisl porta dignissim. Pellentesque orci ante, sollicitudin eget lacus at, scelerisque laoreet nulla. Aliquam sed vestibulum dui. Quisque a lorem imperdiet, mattis sem eget, sodales quam. In rutrum sit amet orci in auctor. Praesent pretium erat vitae erat mattis, vel vulputate ipsum scelerisque. Phasellus sit amet mauris enim. Proin vel est nibh. Nullam tincidunt lobortis mollis. Aliquam viverra vehicula erat, nec sagittis mi pulvinar in. \nAliquam vel justo nulla.Maecenas maximus lobortis enim a cursus.Suspendisse blandit et lectus eget consequat.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.Proin porta eleifend nibh, eu malesuada nisi laoreet et.Fusce vitae arcu aliquam, mollis urna id, suscipit arcu.Etiam et lorem vulputate justo bibendum fermentum.Maecenas in orci magna.Donec ornare, turpis sit amet dictum mattis, metus lacus ultrices lectus, vel blandit lectus tellus vel nisi.Etiam scelerisque pulvinar velit eu imperdiet.Donec sit amet libero accumsan, varius quam ut, semper ipsum.Mauris cursus lorem quam, sed porttitor eros suscipit nec.Mauris hendrerit ullamcorper interdum.",
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
        address: '5 Unreal Street',
        city: "Chicago",
        state: "Illinois",
        country: "USA",
        lat: 51.8781,
        lng: 97.6298,
        name: "Pool",
        description: "Very wet",
        price: 240
      },
      {
        ownerId: 1,
        address: '6 Fake Street',
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
        ownerId: 1,
        address: '3 Fake Street',
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
        ownerId: 1,
        address: '4 Fake Street',
        city: "Chicago",
        state: "Illinois",
        country: "USA",
        lat: 42.8781,
        lng: 88.6298,
        name: "Museum",
        description: "Lots of paitings",
        price: 230
      },
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
