'use strict';

import crypto from 'crypto';
import Promise from 'bluebird';
import moment from 'moment';
import path from 'path';
import _ from 'lodash';

import config from '../../config/environment';

export default function(sequelize, DataTypes) {
  const MODEL_NAME = 'user';
  const MODEL_SCHEMA = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: { type: DataTypes.STRING, field: 'first_name' },
    lastName: { type: DataTypes.STRING, field: 'last_name' },

    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email address exist.'
      },
      validate: {
        isEmail: true
      }
    },

    phone: {
      type: DataTypes.BIGINT,
      set(val) {
        if (typeof val === 'string') {
          val = !val.length || /\D/.test(val.replace(/\s/g, '')) ? null : val;
        }
        this.setDataValue('phone', val);
      }
    },

    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },

    gender: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING
    },
    photo: DataTypes.STRING,
    birthDate: {
      type: DataTypes.DATEONLY,
      get() {
        const date = this.getDataValue('birthDate');
        const mom = moment(date, 'YYYY-MM-DD', true);
        if (!date) {
          return {};
        }

        return {
          date: date,
          humanize: mom.format('Do, MMMM'),
          year: mom.format('YYYY')
        };
      },
      set(val) {
        this.setDataValue('birthDate', val.date);
      }
    },
    provider: { type: DataTypes.STRING, defaultValue: 'local' },
    salt: DataTypes.STRING
  };

  const MODEL_OPTIONS = {
    timestamps: true,
    getterMethods: {
      profile() {
        var title;
        var location;
        var totalExperience;
        if (this.experiences && this.experiences.length) {
          let experiences = _.sortBy(this.experiences, item => {
            return -moment(item.startDate.date, 'YYYY-MM').valueOf();
          });

          let job = experiences[0];
          title = job.title;
          location = job.location.name + ', ' + job.location.country.name;

          var duration = moment.duration();
          _(experiences).forEach(item => {
            const sd = moment(item.startDate.date, 'YYYY-MM');
            const ed = moment(item.endDate.date, 'YYYY-MM');
            duration.add(moment.duration(ed - sd));
          });

          totalExperience = {
            months: duration.months(),
            years: duration.years()
          };
        }

        return {
          name: this.name,
          email: this.email,
          photoUrl: this.photo ? path.join(config.imagesPath, this.photo) : null,
          title,
          location,
          totalExperience
        };
      },
      name() {
        return `${this.firstName} ${this.lastName}`;
      }
    },

    /**
     * Pre-save hooks
     */
    hooks: {
      beforeBulkCreate(users) {
        return Promise.each(users, function(user) {
          return user.updatePassword();
        });
      },

      beforeCreate(user) {
        return user.updatePassword();
      },

      beforeUpdate(user) {
        if (user.changed('password')) {
          return user.updatePassword();
        }
      }
    }
  };

  const MODEL = sequelize.define(MODEL_NAME, MODEL_SCHEMA, MODEL_OPTIONS);

  // --- Instance methods
  /**
   * Make salt for password encryption
   * @param  {Number} byteSize bytesize for encryption
   * @return {Promise}          return salt
   */
  MODEL.prototype.makeSalt = function(byteSize = 16) {
    return new Promise(function(resolve, reject) {
      crypto.randomBytes(byteSize, (err, salt) => {
        if (err) {
          reject(err);
        }
        resolve(salt.toString('base64'));
      });
    });
  };

  /**
   * Check if password is the same
   * @param  {String}   password password to match
   */
  MODEL.prototype.authenticate = function(password) {
    return this.encryptPassword(password).then(encryptPassword => {
      return this.password === encryptPassword;
    });
  };

  /**
   * Encrypt the password
   * @param  {String} password password
   * @return {Promise}          return encrypted password
   */
  MODEL.prototype.encryptPassword = function(password) {
    return new Promise((resolve, reject) => {
      if (!password || !this.salt) {
        reject(null);
      }

      let iterations = 1000;
      let keylength = 64;
      let salt = new Buffer(this.salt, 'base64');

      crypto.pbkdf2(password, salt, iterations, keylength, 'sha1', function(
        err,
        key
      ) {
        if (err) {
          reject(err);
        }
        resolve(key.toString('base64'));
      });
    });
  };

  /**
   * Update the password field with hash password
   * @return {Promise} return hashpassword
   */
  MODEL.prototype.updatePassword = function() {
    return this.makeSalt()
      .then(salt => {
        this.salt = salt;
        return this.encryptPassword(this.password);
      })
      .then(hashedPassword => {
        this.password = hashedPassword;
        return hashedPassword;
      });
  };

  return MODEL;
}
