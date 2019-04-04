'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TagLink = app.articleModel.define('eef_tag_link', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
    module: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
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
    order: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'eef_tag_link',
  });

  TagLink.associate = function() {
    TagLink.belongsTo(app.articleModel.Article, { foreignKey: 'item', targetKey: 'id' });
  };

  return TagLink;
};
