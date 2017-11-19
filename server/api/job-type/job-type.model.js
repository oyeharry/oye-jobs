'use strict';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'job_type';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This job type already exist.'
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
