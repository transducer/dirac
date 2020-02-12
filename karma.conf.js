// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let external_devtools_frontend = true;
let node_modules_path = external_devtools_frontend
    ? ''
    : '../../../../third_party/devtools-node-modules/third_party/node_modules/';

const IS_DEBUG = !!process.env['DEBUG'];
const NOCOVERAGE = !!process.env['NOCOVERAGE'];
const NO_TEXT_COVERAGE = !!process.env['NO_TEXT_COVERAGE'];
const instrumenterPreprocessors = (IS_DEBUG || NOCOVERAGE) ? [] : ['karma-coverage-istanbul-instrumenter'];
const browsers = IS_DEBUG ? ['Chrome'] : ['ChromeHeadless'];

module.exports = function(config) {
  const options = {
    basePath: '',

    files: [
      {pattern: 'front_end/**/*.js', included: false, served: true},
      {pattern: 'test/unittests/**/*.ts', type: 'module'},
      {pattern: 'front_end/**/*.svg', included: false, served: true},
      {pattern: 'front_end/**/*.png', included: false, served: true},
    ],

    // FIXME(https://crbug.com/1006759): Re-enable these tests when ESM work is completed.
    exclude: [
      'test/unittests/**/WorkspaceImpl.ts',
      'test/unittests/**/TempFile.ts',
    ],

    reporters: ['dots', 'coverage-istanbul'],

    preprocessors: {
      './test/unittests/**/*.ts': ['karma-typescript'],
      './front_end/common/*.js': instrumenterPreprocessors,
      './front_end/formatter_worker/*.js': instrumenterPreprocessors,
      './front_end/inline_editor/*.js': instrumenterPreprocessors,
      './front_end/persistence/*.js': instrumenterPreprocessors,
      './front_end/platform/*.js': instrumenterPreprocessors,
      './front_end/protocol/*.js': instrumenterPreprocessors,
      './front_end/sdk/*.js': instrumenterPreprocessors,
      './front_end/text_utils/*.js': instrumenterPreprocessors,
      './front_end/ui/**/*.js': instrumenterPreprocessors,
      './front_end/workspace/*.js': instrumenterPreprocessors,
    },

    browsers,

    frameworks: ['mocha', 'chai', 'sinon', 'karma-typescript'],

    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      compilerOptions: {
        typeRoots: external_devtools_frontend ? undefined : [node_modules_path + '@types'],
        checkJs: false,
        baseUrl: '.',
      },
      coverageOptions: {instrumentation: false},
      bundlerOptions: {resolve: {directories: [node_modules_path]}},
      include: {mode: 'replace', values: ['test/unittests/**/*.ts']},
    },

    proxies: {
      '/front_end': '/base/front_end',
      '/Images': '/base/front_end/Images',
    },

    plugins: [
      require(node_modules_path + 'karma-chrome-launcher'),
      require(node_modules_path + 'karma-mocha'),
      require(node_modules_path + 'karma-chai'),
      require(node_modules_path + 'karma-sinon'),
      require(node_modules_path + 'karma-typescript'),
      require(node_modules_path + 'karma-coverage-istanbul-instrumenter'),
      require(node_modules_path + 'karma-coverage-istanbul-reporter')
    ],

    coverageIstanbulInstrumenter: {esModules: true},

    coverageIstanbulReporter: {
      reports: NO_TEXT_COVERAGE ? ['html', 'json-summary'] : ['text', 'html', 'json-summary'],
      dir: 'karma-coverage'
    },

    singleRun: !IS_DEBUG
  };

  config.set(options);
};
