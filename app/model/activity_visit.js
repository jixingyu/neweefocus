'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ActivityVisit = app.model.define('eef_activity_visit', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    item: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    uid: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_activity_visit',
  });

  ActivityVisit.associate = function() {

  };

  return ActivityVisit;
};
