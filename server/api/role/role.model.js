'use strict';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'role';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    name: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This role name already exist.'
      }
    }
  };

  const MODEL_OPTIONS = {
    timestamps: false,

    /**
     * Pre-save hooks
     */
    hooks: {}
  };

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  return MODEL;
}
