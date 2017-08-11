'use strict';
module.exports = (sequelize, DataTypes) =>  {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        // make associations here
      }
    }
  });
  return User;
};