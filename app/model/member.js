'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Member = app.model.define('eef_member_member', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      unique: true,
    },
    time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_member_member',
  });

  Member.associate = function() {

  };

  return Member;
};
