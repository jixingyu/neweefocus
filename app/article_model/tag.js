'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Tag = app.articleModel.define('eef_tag_tag', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    term: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    count: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_tag_tag',
  });

  Tag.associate = function() {

  };

  return Tag;
};
