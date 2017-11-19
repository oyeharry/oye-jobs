'use strict';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'country';
  const MODEL_SCHEMA = {
    isoCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true,
      field: 'iso_code'
    },

    isoCode2: {
      type: DataTypes.STRING(3),
      allowNull: false,
      field: 'iso_code2'
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
