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

    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: "Cras non ex lorem. Curabitur suscipit libero non enim mattis feugiat. Aliquam imperdiet diam orci, et tristique ligula tincidunt vitae. Proin lobortis risus sed leo blandit, et pretium erat tempus. Etiam ultricies nibh mi, id pellentesque neque iaculis sed. Nam non velit interdum, luctus metus vitae, consequat felis. Nunc nec dapibus metus.",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 3,
        review: "Not good",
        stars: 1,
      },
      {
        spotId: 1,
        userId: 2,
        review: "Fusce sed rutrum nulla, eget cursus enim. Duis tincidunt mattis nisl nec tincidunt. Aenean consectetur blandit metus, eu dapibus lorem elementum sit amet. Aenean at libero molestie justo sollicitudin rhoncus. Sed elementum urna fringilla, accumsan leo eget, volutpat tortor. Maecenas vel luctus enim, gravida posuere odio. Proin finibus ante ac nulla condimentum tristique ac quis metus. Quisque vestibulum augue eu volutpat malesuada. Morbi aliquam diam sit amet fringilla tempus.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Not great",
        stars: 2,
      }

    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
