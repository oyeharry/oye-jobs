'use strict';

import moment from 'moment';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'education';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    schoolName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'school_name'
    },

    studyName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'study_name'
    },

    startDate: {
      type: DataTypes.DATEONLY,
      field: 'start_date',
      get() {
        const mom = moment(this.getDataValue('startDate'), 'YYYY-MM-DD');
        return {
          date: mom.format('YYYY-MM'),
          humanize: mom.format('MMMM, YYYY')
        };
      },
      set(val) {
        this.setDataValue('startDate', val.date);
      }
    },

    endDate: {
      type: DataTypes.DATEONLY,
      field: 'end_date',
      get() {
        const mom = moment(this.getDataValue('endDate'), 'YYYY-MM-DD');
        return {
          date: mom.format('YYYY-MM'),
          humanize: mom.format('MMMM, YYYY')
        };
      },
      set(val) {
        this.setDataValue('endDate', val.date);
      }
    },

    description: DataTypes.TEXT
  };

  const MODEL_OPTIONS = {
    timestamps: false,
    getterMethods: {},

    hooks: {}
  };

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  return MODEL;
}
