/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    user_login: {
      type: DataTypes.STRING(256),
      allowNull: false,
      primaryKey: true
    },
    user_password: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    user_public_key: {
      type: DataTypes.STRING(8192),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(128),
      allowNull: true,
      default: null
    },
    user_salt: {
        type: DataTypes.STRING(128),
        allowNull: true,
        default: null
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
    tableName: 'user'
  });
};
