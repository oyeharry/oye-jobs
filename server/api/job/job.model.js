'use strict';

import moment from 'moment';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'job';
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
    },

    description: DataTypes.TEXT,

    active: { type: DataTypes.BOOLEAN, defaultValue: true },

    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'start_date'
    },

    endDate: {
      type: DataTypes.DATE,
      field: 'end_date'
    }
  };

  const MODEL_OPTIONS = {
    timestamps: true,
    getterMethods: {
      postDate() {
        let d = {};
        if (this.startDate) {
          (d.date = this.startDate), (d.humanize = moment
            .duration(moment(this.startDate) - new Date())
            .humanize(true));
        }
        return d;
      }
    },

    hooks: {
      beforeCreate(job) {
        return job.updateEndDate();
      },

      beforeUpdate(job) {
        return job.updateEndDate();
      }
    }
  };

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  MODEL.prototype.updateEndDate = function() {
    let m = moment(this.endDate, moment.ISO_8601);
    if (this.endDate && moment(this.endDate, moment.ISO_8601).isValid()) {
      this.endDate = m.endOf('day').toDate();
    }
  };

  return MODEL;
}
