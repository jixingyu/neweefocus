'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Activity = app.model.define('eef_activity_activity', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    channel: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1',
    },
    slug: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    submitter: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    status: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_submit: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_start: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_end: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    count_click: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    time_update: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    recommended: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    display_order: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    tag: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName: 'eef_activity_activity',
  });

  Activity.associate = function() {

  };

  return Activity;
};
