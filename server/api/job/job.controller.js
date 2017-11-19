'use strict';

import sequelize from 'sequelize';
import moment from 'moment';
import _ from 'lodash';

import { Job, User, Country, Location, JobType, JobDomain } from '../../sqldb';
import apiResponse from '../../components/api-response';

function getWhereClouse(query) {

  var whereClouse = {};
  if (query.active === 'true') {
    whereClouse.startDate = { $lt: moment().endOf('day').toDate() };
    whereClouse.$or = [
      { endDate: { $gt: moment().startOf('day').toDate() } },
      { endDate: null }
    ];
    whereClouse.active = true;
  }

  if (query.locId) {
    whereClouse['location_id'] = query.locId;
  }

  if (query.search) {
    whereClouse.name = {
      $like: `%${query.search}%`
    };
  }

  return whereClouse;
}

export function index(req, res, next) {
  let query = req.query;

  Job.findAll({
      offset: parseInt(query.from) || 0,
      limit: parseInt(query.size) || 10,
      attributes: ['id', 'name', 'description', 'startDate', 'active'],
      where: getWhereClouse(query),
      include: [{
        model: Location,
        as: 'location',
        attributes: ['name', 'id'],
        include: [{
          model: Country,
          as: 'country',
          attributes: ['name', 'isoCode', 'isoCode2']
        }]
      }, {
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      }]
    })
    .then(jobs => {
      let jobJson = jobs.map(job => {
        job = job.toJSON();
        job.location = {
          id: job.location.id,
          name: `${job.location.name}, ${job.location.country.name}`
        };
        return job;
      });
      res.status(200).json(jobJson);
    })
    .catch(next);
}

export function getJobsLength(req, res, next) {

  Job.count({ where: getWhereClouse(req.query) })
    .then(length => res.status(200).json({ length }))
    .catch(next);
}

export function searchJobs(req, res, next) {
  var query = req.query;

  Job.findAll({
      limit: parseInt(query.size) || 5,
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('name')), 'name']
      ],
      where: {
        $or: [{
          name: {
            $like: `%${query.q}%`
          }
        }]
      }
    })
    .then(jobs => res.status(200).json(jobs))
    .catch(next);
}

// Get my info
export function getJob(req, res, next) {
  Job.find({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'name', 'description', 'startDate', 'endDate', 'active'],
      include: [{
        model: Location,
        as: 'location',
        attributes: ['name', 'id'],
        include: [{
          model: Country,
          as: 'country',
          attributes: ['name', 'isoCode', 'isoCode2']
        }]
      }, {
        model: JobType,
        as: 'jobType',
        attributes: ['name', 'id']
      }, {
        model: JobDomain,
        as: 'jobDomain',
        attributes: ['name', 'id']
      }, {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }, {
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      }]
    })
    .then(job => {
      if (!job) {
        res.status(401).end();
      }

      job = job.toJSON();
      res.status(200).json(job);
    })
    .catch(next);
}

export function getJobUsers(req, res, next) {
  Job.find({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'name'],
      include: [{
        model: Location,
        as: 'location',
        attributes: ['name', 'id'],
        include: [{
          model: Country,
          as: 'country',
          attributes: ['name', 'isoCode', 'isoCode2']
        }]
      }, {
        model: User,
        as: 'users',
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
      }]
    })
    .then(job => {
      if (!job) {
        res.status(401).end();
      }

      job = job.toJSON();

      job.users = _(job.users).map(user => {
        user.applyDate = { date: user['user_job']['created_at'] };
        user.applyDate.humanize = moment
          .duration(moment(user.applyDate.date) - new Date())
          .humanize(true);
        delete user['user_jobs'];
        return user;
      });

      res.status(200).json(job);
    })
    .catch(next);
}

export function updateJob(req, res, next) {
  Job.find({
      where: {
        id: req.params.id
      }
    })
    .then(job => {
      return job
        .update({
          name: req.body.name,
          description: req.body.description,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          active: req.body.active
        })
        .then(job => job.setLocation(req.body.location.id))
        .then(job => job.setJobType(req.body.jobType.id))
        .then(job => job.setAuthor(req.user))
        .then(job => res.status(200).json(job))
        .catch(next);
    })
    .catch(next);
}

export function create(req, res, next) {
  return Job.create(req.body)
    .then(job => job.setLocation(req.body.location.id))
    .then(job => job.setJobType(req.body.jobType.id))
    .then(job => job.setAuthor(req.user))
    .then(job => res.status(200).json(job))
    .catch(next);
}

export function destroy(req, res, next) {
  Job.find({
      where: {
        id: req.params.id
      }
    })
    .then(job => {
      return job.destroy().then(apiResponse(res, 201));
    })
    .catch(next);
}
