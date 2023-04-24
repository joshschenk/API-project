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


    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date("4-11-2023"),
        endDate: new Date("4-22-2023")
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date("3-12-2023"),
        endDate: new Date("3-21-2023")
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date("4-15-2023"),
        endDate: new Date("4-17-2023")
      },
    ])
  },



    down: async (queryInterface, Sequelize) => {
      options.tableName = 'Bookings';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {}, {});
    }

};
