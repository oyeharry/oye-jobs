'use strict';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'location';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  };

  const MODEL_OPTIONS = {};

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  return MODEL;
}
