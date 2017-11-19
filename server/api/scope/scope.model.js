'use strict';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'scope';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },

    description: DataTypes.TEXT
  };

  const MODEL_OPTIONS = {
    timestamps: false
  };

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  return MODEL;
}
