/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('password', {
    uuid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    user: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    login: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    website: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING(512),
        allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'password'
  });
};
