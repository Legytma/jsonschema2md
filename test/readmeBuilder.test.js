/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
const assert = require('assert');
const { assertMarkdown } = require('./assertMarkdown');

const build = require('../lib/readmeBuilder');
const { loader } = require('../lib/schemaProxy');


describe('Testing Readme Builder', () => {
  it('Readme Builder is a function', () => {
    assert.equal(typeof build, 'function');
  });

  it('Readme Builder does nothing when not required', () => {
    const builder = build({ readme: false });
    assert.equal(builder(), null);
  });

  it('Readme Builder builds a small README for a single Schema', () => {
    const builder = build({ readme: true });
    const schemaloader = loader();
    const schemas = [
      schemaloader({
        type: 'object',
        title: 'Test Schema',
        description: 'Not much',
        properties: {
          foo: {
            const: 1,
          },
          obj: {
            type: 'object',
            title: 'An Object',
          },
          arr: {
            type: 'array',
            title: 'An Array',
          },
        },
      }, 'example.schema.json'),
    ];

    const result = builder(schemas);
    // eslint-disable-next-line no-unused-expressions
    assertMarkdown(result)
      .contains('# README')
      .matches(/Top-level Schemas/)
      .has('heading > text')
      .equals('heading > text', {
        type: 'text',
        value: 'README',
      })
      .fuzzy`# README

## Top-level Schemas

-   [Test Schema](./example.md "Not much") – ${undefined}

## Other Schemas

### Objects



### Arrays`;
  });
});
