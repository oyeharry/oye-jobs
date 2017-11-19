'use strict';

import { Country, Location } from '../../sqldb';

export function searchLocations(req, res, next) {
  var query = req.query;

  Location.findAll({
    offset: parseInt(query.from) || 0,
    limit: parseInt(query.size) || 10,
    model: Location,
    as: 'location',
    attributes: ['name', 'id'],
    where: {
      name: {
        $like: `%${query.q}%`
      }
    },
    include: [
      {
        model: Country,
        as: 'country',
        attributes: ['name', 'isoCode', 'isoCode2']
      }
    ]
  })
    .then(locations => {
      var filterLocations = locations.map(l => {
        return {
          id: l.id,
          name: `${l.name}, ${l.country.name}`
        };
      });
      res.status(200).json(filterLocations);
    })
    .catch(next);
}
