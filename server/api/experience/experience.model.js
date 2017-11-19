'use strict';

import moment from 'moment';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'experience';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'company_name'
    },

    currentCompany: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'current_company'
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
        this.setDataValue(
          'startDate',
          moment(val.date, 'YYYY-MM').format('YYYY-MM-DD')
        );
      }
    },

    endDate: {
      type: DataTypes.DATEONLY,
      field: 'end_date',
      get() {
        const df = 'YYYY-MM-DD';
        const curCompany = this.getDataValue('currentCompany');
        const date = curCompany
          ? moment().format(df)
          : this.getDataValue('endDate');
        const mom = moment(date, df);
        return {
          date: mom.format('YYYY-MM'),
          humanize: curCompany ? 'Present' : mom.format('MMMM, YYYY')
        };
      },
      set(val) {
        this.setDataValue(
          'endDate',
          moment(val.date, 'YYYY-MM').format('YYYY-MM-DD')
        );
      }
    },

    description: DataTypes.TEXT
  };

  const MODEL_OPTIONS = {
    timestamps: false,
    getterMethods: {
      totalExperience() {
        if (this.startDate && this.endDate) {
          const sd = moment(this.startDate.date, 'YYYY-MM');
          const ed = moment(this.endDate.date, 'YYYY-MM');
          const duration = moment.duration(ed - sd);
          return {
            months: duration.months(),
            years: duration.years()
          };
        }
      }
    },

    hooks: {}
  };

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  return MODEL;
}
