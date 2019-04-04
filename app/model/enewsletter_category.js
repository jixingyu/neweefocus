'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const EnewsletterCategory = app.model.define('eef_enewsletter_category', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    count: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_enewsletter_category',
  });

  EnewsletterCategory.associate = function() {

  };

  return EnewsletterCategory;
};
