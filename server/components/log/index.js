'use strict';

export default function(...rest) {
  console.log.apply(console, rest); //eslint-disable-line
}
